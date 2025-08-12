
# Script to load testEntity.json into DynamoDB
# The JSON file now contains the complete item structure matching the TypeScript interface

# Update this variable to specify the exact table name (optional - if left empty, script will auto-detect)
$tableName = "FeasibilityStudySections-mddsehxfbjhadgf4uyybg5ecna-NONE"

$data = Get-Content "$PSScriptRoot\testEntity.json" | ConvertFrom-Json

# Use provided table name or auto-detect
if ($tableName -eq "") {
    $table = (aws dynamodb list-tables --profile aidev --region ap-southeast-2 --output json | ConvertFrom-Json).TableNames | Where-Object { $_ -like "FeasibilityStudySections*" } | Select-Object -First 1
    Write-Host "Auto-detected table: $table" -ForegroundColor Yellow
} else {
    $table = $tableName
    Write-Host "Using specified table: $table" -ForegroundColor Yellow
}

# Convert the JSON data to DynamoDB format
$item = @{
    "projectId" = @{ "S" = $data.projectId }
    "sectionId" = @{ "S" = $data.sectionId }
    "sectionName" = @{ "S" = $data.sectionName }
    "percentComplete" = @{ "N" = $data.percentComplete.ToString() }
    "status" = @{ "S" = $data.status }
    "entity" = @{ "S" = ($data.entity | ConvertTo-Json -Depth 10 -Compress) }
}

# Add optional fields if they exist
if ($data.qualityRating) {
    $item["qualityRating"] = @{ "S" = $data.qualityRating }
}

if ($data.createdAt) {
    $item["createdAt"] = @{ "S" = $data.createdAt }
}

if ($data.updatedAt) {
    $item["updatedAt"] = @{ "S" = $data.updatedAt }
}

aws dynamodb put-item --table-name $table --item ($item | ConvertTo-Json -Depth 10) --profile aidev --region ap-southeast-2
Write-Host "Entity loaded into table: $table" -ForegroundColor Green
