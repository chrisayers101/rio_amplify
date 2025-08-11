# Feasibility Study Sections Table Population Script
# This script populates the FeasibilityStudySections DynamoDB table with test data
# using AWS CLI commands

# =============================================================================
# CONFIGURATION - SELECT WHICH ENVIRONMENTS TO POPULATE
# =============================================================================
# Set to $true for environments you want to populate, $false for those you don't
$POPULATE_SANDBOX = $true    # Local development sandbox
$POPULATE_DEV = $false       # Development environment (not built yet)
$POPULATE_MAIN = $false      # Production environment (not built yet)

# =============================================================================
# ENVIRONMENT CONFIGURATIONS
# =============================================================================
$ENVIRONMENTS = @{
    "sandbox" = @{
        "enabled" = $POPULATE_SANDBOX
        "profile" = "aidev"  # Change this to your AWS profile if needed
        "region" = "ap-southeast-2" # Change this to your region
        "table_name" = "" # Will be discovered dynamically
    }
    "dev" = @{
        "enabled" = $POPULATE_DEV
        "profile" = "default"  # Change this to your dev AWS profile
        "region" = "us-east-1" # Change this to your dev region
        "table_name" = "FeasibilityStudySections-dev" # Dev table name (adjust as needed)
    }
    "main" = @{
        "enabled" = $POPULATE_MAIN
        "profile" = "default"  # Change this to your prod AWS profile
        "region" = "us-east-1" # Change this to your prod region
        "table_name" = "FeasibilityStudySections-main" # Prod table name (adjust as needed)
    }
}

# =============================================================================
# TEST DATA - ONE ENTITY FOR TESTING
# =============================================================================
$TEST_ENTITY_JSON = @{
    "sectionName" = "01 - Summary and Recommendations"
    "subSections" = @(
        @{
            "assessment" = @{
                "contradictions" = "Minor"
                "guidelineReference" = "Section 1.1"
                "gaps" = "Seasonal data missing"
                "consistency" = "High"
                "quality" = "High"
            }
            "subSectionTitle" = "1.1 Executive summary"
            "observations" = @()
            "decisions" = @()
            "percentComplete" = 81
            "subSectionId" = "1.1"
            "content" = "### Executive Summary`n`nThe **Amrun Bauxite Project** represents a significant investment in Queensland's mining sector, with an estimated capital expenditure of **AUD 1.9 billion**."
        }
    )
    "observations" = @(
        @{
            "changeOccurred" = $false
            "id" = "01-O1"
            "text" = "Key observation about Summary and Recommendations on AMRUN."
            "source" = "Summary and Recommendations Summary Document"
        }
    )
    "qualityRating" = "High"
    "issues" = @(
        @{
            "description" = "Mock issue for Summary and Recommendations"
            "id" = "01-I1"
            "source" = "Summary and Recommendations Report 2024"
            "status" = "Resolved"
        }
    )
    "content" = "### Executive Summary`n`nThe **Amrun Bauxite Project** represents a significant investment in Queensland's mining sector, with an estimated capital expenditure of **AUD 1.9 billion**."
    "keyRecommendations" = "- Proceed with project development following the recommended timeline`n- Implement comprehensive environmental management plans`n- Establish strong community engagement programs`n- Develop robust risk mitigation strategies"
}

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-AWSProfile {
    param([string]$ProfileName)
    
    try {
        $result = aws sts get-caller-identity --profile $ProfileName 2>$null
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

function Find-FeasibilityStudySectionsTable {
    param(
        [string]$ProfileName,
        [string]$Region
    )
    
    try {
        Write-ColorOutput "🔍 Searching for FeasibilityStudySections table..." "Yellow"
        
        # Get all tables
        $tablesJson = aws dynamodb list-tables --profile $ProfileName --region $Region --output json 2>$null
        
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput "❌ Failed to list DynamoDB tables" "Red"
            return $null
        }
        
        $tables = $tablesJson | ConvertFrom-Json
        
        # Find table that starts with "FeasibilityStudySections"
        $targetTable = $tables.TableNames | Where-Object { $_ -like "FeasibilityStudySections*" } | Select-Object -First 1
        
        if ($targetTable) {
            Write-ColorOutput "✅ Found table: $targetTable" "Green"
            return $targetTable
        } else {
            Write-ColorOutput "❌ No FeasibilityStudySections table found" "Red"
            return $null
        }
    }
    catch {
        Write-ColorOutput "❌ Error searching for table: $($_.Exception.Message)" "Red"
        return $null
    }
}

function Test-DynamoDBTable {
    param(
        [string]$TableName,
        [string]$ProfileName,
        [string]$Region
    )
    
    try {
        $result = aws dynamodb describe-table --table-name $TableName --profile $ProfileName --region $Region 2>$null
        return $LASTEXITCODE -eq 0
    }
    catch {
        return $false
    }
}

function Convert-ToDynamoDBFormat {
    param([hashtable]$Data)
    
    $dynamoItem = @{
        "projectId" = @{ "S" = "AMRUN" }
        "sectionId" = @{ "S" = "01" }
        "percentComplete" = @{ "N" = "83" }
        "status" = @{ "S" = "in_progress" }
        "createdAt" = @{ "S" = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ") }
        "updatedAt" = @{ "S" = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ") }
        "entity" = @{ "M" = @{} }
    }
    
    # Convert sectionName
    $dynamoItem.entity.M["sectionName"] = @{ "S" = $Data.sectionName }
    
    # Convert qualityRating
    $dynamoItem.entity.M["qualityRating"] = @{ "S" = $Data.qualityRating }
    
    # Convert content (now a simple string)
    $dynamoItem.entity.M["content"] = @{ "S" = $Data.content }
    
    # Convert keyRecommendations (now a top-level field)
    $dynamoItem.entity.M["keyRecommendations"] = @{ "S" = $Data.keyRecommendations }
    
    # Convert issues
    $issuesList = @()
    foreach ($issue in $Data.issues) {
        $issuesList += @{
            "M" = @{
                "id" = @{ "S" = $issue.id }
                "description" = @{ "S" = $issue.description }
                "status" = @{ "S" = $issue.status }
                "source" = @{ "S" = $issue.source }
            }
        }
    }
    $dynamoItem.entity.M["issues"] = @{ "L" = $issuesList }
    
    # Convert observations
    $observationsList = @()
    foreach ($observation in $Data.observations) {
        $observationsList += @{
            "M" = @{
                "id" = @{ "S" = $observation.id }
                "text" = @{ "S" = $observation.text }
                "source" = @{ "S" = $observation.source }
                "changeOccurred" = @{ "BOOL" = $observation.changeOccurred }
            }
        }
    }
    $dynamoItem.entity.M["observations"] = @{ "L" = $observationsList }
    
    # Convert subSections
    $subSectionsList = @()
    foreach ($subSection in $Data.subSections) {
        $subSectionsList += @{
            "M" = @{
                "subSectionId" = @{ "S" = $subSection.subSectionId }
                "subSectionTitle" = @{ "S" = $subSection.subSectionTitle }
                "percentComplete" = @{ "N" = $subSection.percentComplete.ToString() }
                "content" = @{ "S" = $subSection.content }
                "assessment" = @{
                    "M" = @{
                        "quality" = @{ "S" = $subSection.assessment.quality }
                        "consistency" = @{ "S" = $subSection.assessment.consistency }
                        "contradictions" = @{ "S" = $subSection.assessment.contradictions }
                        "gaps" = @{ "S" = $subSection.assessment.gaps }
                        "guidelineReference" = @{ "S" = $subSection.assessment.guidelineReference }
                    }
                }
                "observations" = @{ "L" = @() }
                "decisions" = @{ "L" = @() }
            }
        }
    }
    $dynamoItem.entity.M["subSections"] = @{ "L" = $subSectionsList }
    
    return $dynamoItem
}

function Add-EntityToTable {
    param(
        [string]$EnvironmentName,
        [hashtable]$EnvironmentConfig,
        [hashtable]$EntityData
    )
    
    Write-ColorOutput "`n=== Adding entity to $EnvironmentName environment ===" "Cyan"
    Write-ColorOutput "Profile: $($EnvironmentConfig.profile)" "Yellow"
    Write-ColorOutput "Region: $($EnvironmentConfig.region)" "Yellow"
    
    # For sandbox, discover the table name dynamically
    if ($EnvironmentName -eq "sandbox" -and [string]::IsNullOrEmpty($EnvironmentConfig.table_name)) {
        $tableName = Find-FeasibilityStudySectionsTable -ProfileName $EnvironmentConfig.profile -Region $EnvironmentConfig.region
        if (-not $tableName) {
            Write-ColorOutput "❌ Could not find FeasibilityStudySections table" "Red"
            return $false
        }
        $EnvironmentConfig.table_name = $tableName
    }
    
    Write-ColorOutput "Table: $($EnvironmentConfig.table_name)" "Yellow"
    
    # Test AWS profile
    if (-not (Test-AWSProfile -ProfileName $EnvironmentConfig.profile)) {
        Write-ColorOutput "❌ AWS profile '$($EnvironmentConfig.profile)' not found or invalid" "Red"
        return $false
    }
    
    # Test if table exists
    if (-not (Test-DynamoDBTable -TableName $EnvironmentConfig.table_name -ProfileName $EnvironmentConfig.profile -Region $EnvironmentConfig.region)) {
        Write-ColorOutput "❌ DynamoDB table '$($EnvironmentConfig.table_name)' not found in $($EnvironmentConfig.region)" "Red"
        return $false
    }
    
    # Convert the JSON data to DynamoDB format
    $dynamoItem = Convert-ToDynamoDBFormat -Data $EntityData
    
    # Convert entity data to JSON for AWS CLI
    $entityJson = $dynamoItem | ConvertTo-Json -Depth 10
    
    try {
        # Add item to DynamoDB table
        $result = aws dynamodb put-item `
            --table-name $EnvironmentConfig.table_name `
            --item $entityJson `
            --profile $EnvironmentConfig.profile `
            --region $EnvironmentConfig.region `
            2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✅ Successfully added entity to $EnvironmentName environment" "Green"
            return $true
        } else {
            Write-ColorOutput "❌ Failed to add entity to $EnvironmentName environment" "Red"
            Write-ColorOutput "Error: $result" "Red"
            return $false
        }
    }
    catch {
        Write-ColorOutput "❌ Exception occurred while adding entity to $EnvironmentName environment" "Red"
        Write-ColorOutput "Error: $($_.Exception.Message)" "Red"
        return $false
    }
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================
Write-ColorOutput "🚀 Feasibility Study Sections Table Population Script" "Green"
Write-ColorOutput "==================================================" "Green"

# Check if AWS CLI is installed
try {
    $awsVersion = aws --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✅ AWS CLI found: $awsVersion" "Green"
    } else {
        Write-ColorOutput "❌ AWS CLI not found. Please install AWS CLI first." "Red"
        exit 1
    }
} catch {
    Write-ColorOutput "❌ AWS CLI not found. Please install AWS CLI first." "Red"
    exit 1
}

# Process each environment
$successCount = 0
$totalCount = 0

foreach ($env in $ENVIRONMENTS.GetEnumerator()) {
    $envName = $env.Key
    $envConfig = $env.Value
    
    if ($envConfig.enabled) {
        $totalCount++
        Write-ColorOutput "`n🔧 Processing $envName environment..." "Yellow"
        
        if (Add-EntityToTable -EnvironmentName $envName -EnvironmentConfig $envConfig -EntityData $TEST_ENTITY_JSON) {
            $successCount++
        }
    } else {
        Write-ColorOutput "`n⏭️  Skipping $envName environment (disabled)" "Gray"
    }
}

# Summary
Write-ColorOutput "`n📊 SUMMARY" "Cyan"
Write-ColorOutput "==========" "Cyan"
Write-ColorOutput "Total environments processed: $totalCount" "White"
Write-ColorOutput "Successful: $successCount" "Green"
Write-ColorOutput "Failed: $($totalCount - $successCount)" "Red"

if ($successCount -gt 0) {
    Write-ColorOutput "`n🎉 Script completed successfully!" "Green"
} else {
    Write-ColorOutput "`n💥 Script completed with errors. Check the output above." "Red"
    exit 1
}
