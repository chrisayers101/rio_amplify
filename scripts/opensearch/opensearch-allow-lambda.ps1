param(
    [string]$DomainName = "amplify-os-dev",
    [string]$Region = "ap-southeast-2",
    [string]$Profile = "aidev",
    [string]$AccountId,
    [string]$RoleArn,
    [string]$StackName
)

$ErrorActionPreference = "Stop"

function Write-Step($msg) { Write-Host "[allow-lambda] $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "[allow-lambda] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "[allow-lambda] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[allow-lambda] $msg" -ForegroundColor Red }

Write-Step "Preparing to update access policy for domain '$DomainName' in $Region"

if (-not $AccountId -or $AccountId.Trim().Length -eq 0) {
    Write-Step "Resolving AWS account from profile '$Profile'"
    $AccountId = aws sts get-caller-identity --profile $Profile --query Account --output text
}
Write-Ok   "Account: $AccountId"

if (-not $RoleArn -and $StackName) {
    Write-Step "Looking up Lambda Role ARN from stack '$StackName'"
    $RoleArn = aws cloudformation describe-stacks --stack-name $StackName --region $Region --profile $Profile --query "Stacks[0].Outputs[?OutputKey=='OpenSearchProxyLambdaRoleArn'].OutputValue" --output text 2>$null
}

if (-not $RoleArn -or $RoleArn -eq "None" -or $RoleArn.Trim().Length -eq 0) {
    throw "RoleArn not provided and could not be resolved. Pass -RoleArn or -StackName."
}
Write-Ok   "Lambda Role ARN: $RoleArn"

$resourceArn = "arn:aws:es:${Region}:${AccountId}:domain/${DomainName}/*"

Write-Step "Fetching current domain access policy..."
$desc = aws opensearch describe-domain --region $Region --profile $Profile --domain-name $DomainName | ConvertFrom-Json
$policyText = $desc.DomainStatus.AccessPolicies

$policy = $null
if ([string]::IsNullOrWhiteSpace($policyText)) {
    Write-Warn "No existing policy found. Creating a new one."
    $policy = @{ Version = '2012-10-17'; Statement = @() }
} else {
    $policy = $policyText | ConvertFrom-Json
}

if (-not $policy.Statement) { $policy.Statement = @() }

# Ensure root account stays allowed if it was present originally
$hasRoot = $false
foreach ($st in @($policy.Statement)) {
    $p = $st.Principal
    if ($p -and $p.AWS -and $p.AWS -match ":${AccountId}:root$") { $hasRoot = $true; break }
}

if (-not $hasRoot) {
    Write-Warn "Adding root principal allow for safety"
    $policy.Statement += @{
        Effect = 'Allow'
        Principal = @{ AWS = "arn:aws:iam::${AccountId}:root" }
        Action = 'es:*'
        Resource = $resourceArn
    }
}

# Add or update the Lambda role statement
$existingIdx = -1
for ($i = 0; $i -lt $policy.Statement.Count; $i++) {
    $st = $policy.Statement[$i]
    if ($st.Principal -and $st.Principal.AWS -and ($st.Principal.AWS -eq $RoleArn)) { $existingIdx = $i; break }
}

$lambdaStatement = @{
    Effect = 'Allow'
    Principal = @{ AWS = $RoleArn }
    Action = @('es:ESHttpGet','es:ESHttpPost')
    Resource = $resourceArn
}

if ($existingIdx -ge 0) {
    Write-Step "Updating existing statement for Lambda role"
    $policy.Statement[$existingIdx] = $lambdaStatement
} else {
    Write-Step "Adding new statement for Lambda role"
    $policy.Statement += $lambdaStatement
}

$tmp = New-TemporaryFile
$json = $policy | ConvertTo-Json -Depth 10
$json | Set-Content -Path $tmp -Encoding UTF8

Write-Step "Submitting updated access policy..."
aws opensearch update-domain-config --region $Region --profile $Profile --domain-name $DomainName --access-policies file://$tmp | Out-Null

Write-Ok "Policy updated. Waiting for Processing=false..."
while ($true) {
    Start-Sleep -Seconds 5
    $d = aws opensearch describe-domain --region $Region --profile $Profile --domain-name $DomainName | ConvertFrom-Json
    if (-not $d.DomainStatus.Processing) { break }
}

$final = aws opensearch describe-domain --region $Region --profile $Profile --domain-name $DomainName | ConvertFrom-Json
$finalPolicy = $final.DomainStatus.AccessPolicies | ConvertFrom-Json

Write-Ok   "Done. Current statements: $($finalPolicy.Statement.Count)"
Write-Host ($finalPolicy | ConvertTo-Json -Depth 10) -ForegroundColor Gray

Remove-Item $tmp -ErrorAction SilentlyContinue


