# Creates an Amazon OpenSearch Service domain for dev/testing
# Usage examples:
#   ./create-opensearch-domain.ps1 -DomainName amplify-os-dev -PublicAccess -Profile aidev
#   ./create-opensearch-domain.ps1 -DomainName amplify-os-dev -VpcId vpc-abc -SubnetIds subnet-1,subnet-2,subnet-3 -SecurityGroupIds sg-123 -Profile aidev

param(
    [string]$DomainName = "amplify-os-dev",
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
    [string[]]$SecurityGroupIds
)

$ErrorActionPreference = "Stop"

function Write-Step($msg) { Write-Host "[create-os] $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "[create-os] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[create-os] $msg" -ForegroundColor Yellow }

Write-Step "Resolving AWS account..."
$accountId = aws sts get-caller-identity --profile $Profile --query Account --output text 2>$null
if (-not $accountId) { throw "Unable to resolve AWS account. Check your --profile." }
Write-Ok   "Account: $accountId"

# Build access policy: allow account root by default
$resourceArn = "arn:aws:es:${Region}:${accountId}:domain/${DomainName}/*"
$policy = @{ 
    Version = "2012-10-17";
    Statement = @(@{
        Effect    = "Allow";
        Principal = @{ AWS = "arn:aws:iam::${accountId}:root" };
        Action    = "es:*";
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

