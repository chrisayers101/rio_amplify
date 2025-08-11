
# Minimal script to load testEntity.json into DynamoDB
$data = Get-Content "$PSScriptRoot\testEntity.json" | ConvertFrom-Json
$table = (aws dynamodb list-tables --profile aidev --region ap-southeast-2 --output json | ConvertFrom-Json).TableNames | Where-Object { $_ -like "FeasibilityStudySections*" } | Select-Object -First 1

# Simple conversion - just store as JSON string for now
$item = @{
    "projectId" = @{ "S" = "AMRUN" }
    "sectionId" = @{ "S" = "01" }
    "percentComplete" = @{ "N" = "83" }
    "status" = @{ "S" = "in_progress" }
    "entity" = @{ "S" = ($data | ConvertTo-Json -Depth 10 -Compress) }
}

aws dynamodb put-item --table-name $table --item ($item | ConvertTo-Json -Depth 10) --profile aidev --region ap-southeast-2
Write-Host "Entity loaded into table: $table" -ForegroundColor Green
