# Simple script to load testEntity.json into DynamoDB
# Works on Windows PowerShell 5.x and PowerShell 7+

$ErrorActionPreference = 'Stop'

# Array of table names to update
$tableNames = @(
  "FeasibilityStudySections-mddsehxfbjhadgf4uyybg5ecna-NONE",
  "FeasibilityStudySections-jb4g3t63b5f23jcybwv27gzg7y-NONE"
)

# Read JSON file once as a single string, then parse
$data = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'testEntity.json') -Raw | ConvertFrom-Json

Write-Host ("Loading {0} items into {1} tables" -f $data.Count, $tableNames.Count)

foreach ($tableName in $tableNames) {
  Write-Host "`n=== Processing Table: $tableName ==="

  foreach ($item in $data) {
    Write-Host ("Loading: {0}" -f $item.sectionName)

    # Build the entity map structure properly for DynamoDB
    $entityMap = @{
      content           = @{ S = $item.entity.content }
      percentComplete   = @{ N = ($item.entity.percentComplete).ToString() }
      status            = @{ S = $item.entity.status }
      qualityRating     = @{ S = $item.entity.qualityRating }
    }

    if ($null -eq $item.entity.qualityAssessment) {
      $entityMap.qualityAssessment = @{ NULL = $true }
    }
    else {
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

    # Convert to compact JSON and write to a temp file (UTF-8 WITHOUT BOM)
    $json = $dynamoItem | ConvertTo-Json -Depth 10 -Compress
    $tmp  = [System.IO.Path]::GetTempFileName()
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($tmp, $json, $utf8NoBom)

    try {
      # Use argument array (no fragile backticks)
      $args = @(
        'dynamodb','put-item',
        '--table-name', $tableName,
        '--item', "file://$tmp",
        '--profile', 'aidev',
        '--region', 'ap-southeast-2'
      )

      aws @args

      Write-Host ("Success: {0}" -f $item.sectionName)
    }
    catch {
      Write-Host ("Failed: {0}" -f $item.sectionName)
      Write-Host ($_ | Out-String)
    }
    finally {
      Remove-Item -LiteralPath $tmp -ErrorAction SilentlyContinue
    }
  }

  Write-Host ("=== Completed Table: {0} ===" -f $tableName)
}

Write-Host "`nAll tables processed successfully!"
