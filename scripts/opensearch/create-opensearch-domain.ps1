# ./scripts/opensearch/create-opensearch-domain.ps1 `
#   -DomainName amplify-os-dev `
#   -Region ap-southeast-2 `
#   -Profile aidev `
#   -PublicAccess `
#   -MasterUserName osadmin `
#   -MasterUserPassword 'Bonnie220241!' `
#   -LambdaRoleArn arn:aws:iam::029109261863:role/amplify-amplifybase-chris-opensearchproxylambdaServ-ZOuwpGn12VBS

  param(
    [string]$DomainName = "mining",
    [string]$Region = "ap-southeast-2",
    [string]$Profile = "aidev",
    [string]$EngineVersion = "OpenSearch_2.19",
    [string]$InstanceType = "t3.small.search",
    [int]$InstanceCount = 1,
    [int]$EbsVolumeSize = 10,
    [string]$EbsVolumeType = "gp3",
    [string]$KmsKeyId,
    [switch]$PublicAccess,
    [string]$VpcId,
    [string[]]$SubnetIds,
    [string[]]$SecurityGroupIds,
    # Fine-Grained Access Control (FGAC) + Cognito integration
    [switch]$EnableCognito,
    [string]$UserPoolId,
    [string]$IdentityPoolId,
    [string]$CognitoServiceRoleArn,
    [string[]]$CognitoAuthRoleArns,
    # Master user: prefer IAM principal (role/user) via ARN; alternatively internal user database
    [string]$MasterUserArn,
    [string]$MasterUserName,
    [string]$MasterUserPassword,
    # App/automation principals that should be able to call the domain (e.g., Lambda role)
    [string]$LambdaRoleArn
)

$ErrorActionPreference = "Stop"

function Write-Step($msg) { Write-Host "[create-os] $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "[create-os] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[create-os] $msg" -ForegroundColor Yellow }

Write-Step "Resolving AWS account..."
$accountId = aws sts get-caller-identity --profile $Profile --query Account --output text 2>$null
if (-not $accountId) { throw "Unable to resolve AWS account. Check your --profile." }
Write-Ok   "Account: $accountId"

# Build access policy
$resourceArn = "arn:aws:es:${Region}:${accountId}:domain/${DomainName}/*"

# Principals allowed to call the domain's HTTPS API. Start with account root for admin tasks.
$principals = @("arn:aws:iam::${accountId}:root")
if ($CognitoAuthRoleArns -and $CognitoAuthRoleArns.Count -gt 0) { $principals += $CognitoAuthRoleArns }
if ($LambdaRoleArn) { $principals += $LambdaRoleArn }

$policy = @{
    Version = "2012-10-17";
    Statement = @(@{
        Effect    = "Allow";
        Principal = @{ AWS = $principals };
        # For Dashboards and general API calls we only need the ESHttp* actions
        Action    = "es:ESHttp*";
        Resource  = $resourceArn;
    })
} | ConvertTo-Json -Depth 5 -Compress

# Build domain spec
$spec = @{
    DomainName = $DomainName
    EngineVersion = $EngineVersion
    ClusterConfig = @{
        InstanceType = $InstanceType
        InstanceCount = $InstanceCount
        ZoneAwarenessEnabled = $false
    }
    EBSOptions = @{
        EBSEnabled = $true
        VolumeType = $EbsVolumeType
        VolumeSize = $EbsVolumeSize
    }
    DomainEndpointOptions = @{
        EnforceHTTPS = $true
        TLSSecurityPolicy = "Policy-Min-TLS-1-2-2019-07"
    }
    NodeToNodeEncryptionOptions = @{ Enabled = $true }
    EncryptionAtRestOptions     = @{ Enabled = $true }
    AccessPolicies = $policy
}

if ($KmsKeyId) {
    $spec.EncryptionAtRestOptions = @{ Enabled = $true; KmsKeyId = $KmsKeyId }
}

# Fine-Grained Access Control (with optional Cognito integration)
if ($EnableCognito -or $MasterUserArn -or $MasterUserName) {
    $aso = @{ Enabled = $true }

    if ($MasterUserArn) {
        # Master user as an IAM principal; internal DB not required
        $aso.InternalUserDatabaseEnabled = $false
        $aso.MasterUserOptions = @{ MasterUserARN = $MasterUserArn }
    } elseif ($MasterUserName -and $MasterUserPassword) {
        # Use the internal user database; create a master user
        $aso.InternalUserDatabaseEnabled = $true
        $aso.MasterUserOptions = @{ MasterUserName = $MasterUserName; MasterUserPassword = $MasterUserPassword }
    } else {
        throw "FGAC requested but no master user provided. Provide -MasterUserArn or (-MasterUserName and -MasterUserPassword)."
    }

    $spec.AdvancedSecurityOptions = $aso
}

if ($EnableCognito) {
    if (-not ($UserPoolId -and $IdentityPoolId -and $CognitoServiceRoleArn)) {
        throw "-EnableCognito requires -UserPoolId, -IdentityPoolId, and -CognitoServiceRoleArn."
    }
    $spec.CognitoOptions = @{ Enabled = $true; UserPoolId = $UserPoolId; IdentityPoolId = $IdentityPoolId; RoleArn = $CognitoServiceRoleArn }
}

if ($VpcId -and $SubnetIds -and $SubnetIds.Count -gt 0) {
    Write-Step "Configuring VPC endpoints ($VpcId)"
    $spec.VPCOptions = @{ SubnetIds = $SubnetIds; SecurityGroupIds = $SecurityGroupIds }
} elseif (-not $PublicAccess) {
    Write-Warn "No VPC provided. Creating a PUBLIC dev domain. Use -PublicAccess to suppress this warning."
}

$tmp = New-TemporaryFile
$spec | ConvertTo-Json -Depth 10 | Set-Content -Path $tmp -Encoding UTF8
Write-Step "Creating domain '$DomainName' in $Region..."
aws opensearch create-domain --region $Region --profile $Profile --cli-input-json file://$tmp | Out-Null

Write-Step "Waiting for domain to become Active (this can take several minutes)..."
while ($true) {
    Start-Sleep -Seconds 20
    $desc = aws opensearch describe-domain --region $Region --profile $Profile --domain-name $DomainName | ConvertFrom-Json
    $processing = $desc.DomainStatus.Processing
    $endpoint = $desc.DomainStatus.Endpoints | Select-Object -First 1 | ForEach-Object { $_.PSObject.Properties.Value }
    Write-Step ("Status: Processing={0} Endpoint={1}" -f $processing, ($endpoint -as [string]))
    if (-not $processing) { break }
}

$out = aws opensearch describe-domain --region $Region --profile $Profile --domain-name $DomainName | ConvertFrom-Json
$endpoint = $out.DomainStatus.Endpoints | Select-Object -First 1 | ForEach-Object { $_.PSObject.Properties.Value }
$arn = $out.DomainStatus.ARN

Write-Ok "Domain created!"
Write-Host ("Endpoint: {0}" -f ($endpoint -as [string])) -ForegroundColor Green
Write-Host ("ARN:      {0}" -f $arn) -ForegroundColor Green

Remove-Item $tmp -ErrorAction SilentlyContinue

