# Simple script to load testEntity.json into DynamoDB

# Array of table names to update
$tableNames = @(
  "FeasibilityStudySections-mddsehxfbjhadgf4uyybg5ecna-NONE",
  "FeasibilityStudySections-jb4g3t63b5f23jcybwv27gzg7y-NONE"
)

# Read JSON file once as a single string, then parse
$data = Get-Content "$PSScriptRoot\testEntity.json" -Raw | ConvertFrom-Json

Write-Host "Loading $($data.Count) items into $($tableNames.Count) tables"

foreach ($tableName in $tableNames) {
  Write-Host "`n=== Processing Table: $tableName ==="

  foreach ($item in $data) {
    Write-Host "Loading: $($item.sectionName)"

    # Build the entity map structure properly for DynamoDB
    $entityMap = @{
      content         = @{ S = $item.entity.content }
      percentComplete = @{ N = ($item.entity.percentComplete).ToString() }
      status          = @{ S = $item.entity.status }
      qualityRating   = @{ S = $item.entity.qualityRating }
    }
    if ($null -eq $item.entity.qualityAssessment) {
      $entityMap.qualityAssessment = @{ NULL = $true }
    } else {
      $entityMap.qualityAssessment = @{ S = $item.entity.qualityAssessment }
    }

    $dynamoItem = @{
      projectId   = @{ S = $item.projectId }
      sectionId   = @{ S = $item.sectionId }
      sectionName = @{ S = $item.sectionName }
      createdAt   = @{ S = $item.createdAt }
      updatedAt   = @{ S = $item.updatedAt }
      entity      = @{ M = $entityMap }
    }

    # Convert to compact JSON and write to a temp file
    $json = $dynamoItem | ConvertTo-Json -Depth 10 -Compress
    $tmp  = [System.IO.Path]::GetTempFileName()
    Set-Content -Path $tmp -Value $json -Encoding UTF8

    try {
      aws dynamodb put-item `
        --table-name $tableName `
        --item file://$tmp `
        --profile aidev `
        --region ap-southeast-2
      Write-Host "✓ Success: $($item.sectionName)"
    } catch {
      Write-Host "✗ Failed: $($item.sectionName)"
      Write-Host $_
    } finally {
      Remove-Item $tmp -ErrorAction SilentlyContinue
    }
  }

  Write-Host "=== Completed Table: $tableName ==="
}

Write-Host "`nAll tables processed successfully!"
