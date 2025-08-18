# Simple script to load testEntity.json into DynamoDB
# Array of table names to update
$tableNames = @(
    "FeasibilityStudySections-jb4g3t63b5f23jcybwv27gzg7y-NONE",
    "FeasibilityStudySections-mddsehxfbjhadgf4uyybg5ecna-NONE"
    # Add more table names as needed
)

$data = Get-Content "$PSScriptRoot\testEntity.json" | ConvertFrom-Json

Write-Host "Loading $($data.Count) items into $($tableNames.Count) tables" -ForegroundColor Green

foreach ($tableName in $tableNames) {
    Write-Host "`n=== Processing Table: $tableName ===" -ForegroundColor Cyan
    
    foreach ($item in $data) {
        Write-Host "Loading: $($item.sectionName)" -ForegroundColor Yellow
        
        $dynamoItem = @{
            "projectId" = @{ "S" = $item.projectId }
            "sectionId" = @{ "S" = $item.sectionId }
            "sectionName" = @{ "S" = $item.sectionName }
            "percentComplete" = @{ "N" = $item.percentComplete.ToString() }
            "status" = @{ "S" = $item.status }
            "qualityRating" = @{ "S" = $item.qualityRating }
            "createdAt" = @{ "S" = $item.createdAt }
            "updatedAt" = @{ "S" = $item.updatedAt }
            "entity" = @{ "S" = ($item.entity | ConvertTo-Json -Depth 10 -Compress) }
        }
        
        try {
            aws dynamodb put-item --table-name $tableName --item ($dynamoItem | ConvertTo-Json -Depth 10) --profile aidev --region ap-southeast-2
            Write-Host "✓ Success: $($item.sectionName)" -ForegroundColor Green
        } catch {
            Write-Host "✗ Failed: $($item.sectionName)" -ForegroundColor Red
        }
    }
    
    Write-Host "=== Completed Table: $tableName ===" -ForegroundColor Cyan
}

Write-Host "`nAll tables processed successfully!" -ForegroundColor Green