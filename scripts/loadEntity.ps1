# Script to load testEntity.json into DynamoDB
# The JSON file now contains an array of items to be loaded

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

# Check if data is an array or single item
if ($data -is [array]) {
    Write-Host "Loading $($data.Count) items into DynamoDB..." -ForegroundColor Cyan
    
    # Process each item in the array
    for ($i = 0; $i -lt $data.Count; $i++) {
        $item = $data[$i]
        Write-Host "Processing item $($i + 1) of $($data.Count): $($item.sectionName)" -ForegroundColor Yellow
        
        # Convert the JSON data to DynamoDB format
        $dynamoItem = @{
            "projectId" = @{ "S" = $item.projectId }
            "sectionId" = @{ "S" = $item.sectionId }
            "sectionName" = @{ "S" = $item.sectionName }
            "percentComplete" = @{ "N" = $item.percentComplete.ToString() }
            "status" = @{ "S" = $item.status }
            "entity" = @{ "S" = ($item.entity | ConvertTo-Json -Depth 10 -Compress) }
        }

        # Add optional fields if they exist
        if ($item.qualityRating) {
            $dynamoItem["qualityRating"] = @{ "S" = $item.qualityRating }
        }

        if ($item.createdAt) {
            $dynamoItem["createdAt"] = @{ "S" = $item.createdAt }
        }

        if ($item.updatedAt) {
            $dynamoItem["updatedAt"] = @{ "S" = $item.updatedAt }
        }

        # Load item into DynamoDB
        try {
            aws dynamodb put-item --table-name $table --item ($dynamoItem | ConvertTo-Json -Depth 10) --profile aidev --region ap-southeast-2
            Write-Host "✓ Successfully loaded item $($i + 1): $($item.sectionName)" -ForegroundColor Green
        } catch {
            Write-Host "✗ Failed to load item $($i + 1): $($item.sectionName)" -ForegroundColor Red
            Write-Host "Error: $_" -ForegroundColor Red
        }
    }
    
    Write-Host "Completed loading $($data.Count) items into table: $table" -ForegroundColor Green
} else {
    # Handle single item (backward compatibility)
    Write-Host "Loading single item into DynamoDB..." -ForegroundColor Cyan
    
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

    # Load item into DynamoDB
    try {
        aws dynamodb put-item --table-name $table --item ($item | ConvertTo-Json -Depth 10) --profile aidev --region ap-southeast-2
        Write-Host "✓ Successfully loaded single item: $($data.sectionName)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to load item: $($data.sectionName)" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
    }
    
    Write-Host "Completed loading item into table: $table" -ForegroundColor Green
}