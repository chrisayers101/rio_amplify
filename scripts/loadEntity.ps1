# Simple script to load testEntity.json into DynamoDB
$tableName = "FeasibilityStudySections-mddsehxfbjhadgf4uyybg5ecna-NONE"
$data = Get-Content "$PSScriptRoot\testEntity.json" | ConvertFrom-Json

Write-Host "Loading $($data.Count) items into table: $tableName" -ForegroundColor Green

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

Write-Host "Done!" -ForegroundColor Green