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
$TEST_ENTITY = @{
    "projectId" = @{ "S" = "AMRUN" }
    "sectionId" = @{ "S" = "01" }
    "percentComplete" = @{ "N" = "83" }
    "status" = @{ "S" = "in_progress" }
    "createdAt" = @{ "S" = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ") }
    "updatedAt" = @{ "S" = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ") }
    "entity" = @{
        "M" = @{
            "sectionName" = @{ "S" = "01 - Summary and Recommendations" }
            "qualityRating" = @{ "S" = "High" }
            "content" = @{
                "M" = @{
                    "executiveSummary" = @{ "S" = "The Amrun Bauxite Project represents a significant investment in Queensland's mining sector, with an estimated capital expenditure of AUD 1.9 billion." }
                    "keyRecommendations" = @{
                        "L" = @(
                            @{ "S" = "Proceed with project development following the recommended timeline" },
                            @{ "S" = "Implement comprehensive environmental management plans" },
                            @{ "S" = "Establish strong community engagement programs" },
                            @{ "S" = "Develop robust risk mitigation strategies" }
                        )
                    }
                }
            }
            "issues" = @{
                "L" = @(
                    @{
                        "M" = @{
                            "id" = @{ "S" = "01-I1" }
                            "description" = @{ "S" = "Mock issue for Summary and Recommendations" }
                            "status" = @{ "S" = "Resolved" }
                            "source" = @{ "S" = "Summary and Recommendations Report 2024" }
                        }
                    }
                )
            }
            "observations" = @{
                "L" = @(
                    @{
                        "M" = @{
                            "id" = @{ "S" = "01-O1" }
                            "text" = @{ "S" = "Key observation about Summary and Recommendations on AMRUN." }
                            "source" = @{ "S" = "Summary and Recommendations Summary Document" }
                            "changeOccurred" = @{ "BOOL" = $false }
                        }
                    }
                )
            }
            "subSections" = @{
                "L" = @(
                    @{
                        "M" = @{
                            "subSectionId" = @{ "S" = "1.1" }
                            "subSectionTitle" = @{ "S" = "1.1 Executive summary" }
                            "percentComplete" = @{ "N" = "81" }
                            "content" = @{ "M" = @{} }
                            "assessment" = @{
                                "M" = @{
                                    "quality" = @{ "S" = "High" }
                                    "consistency" = @{ "S" = "High" }
                                    "contradictions" = @{ "S" = "Minor" }
                                    "gaps" = @{ "S" = "Seasonal data missing" }
                                    "guidelineReference" = @{ "S" = "Section 1.1" }
                                }
                            }
                            "observations" = @{ "L" = @() }
                            "decisions" = @{ "L" = @() }
                        }
                    }
                )
            }
        }
    }
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
    
    # Convert entity data to JSON for AWS CLI
    $entityJson = $EntityData | ConvertTo-Json -Depth 10
    
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
        
        if (Add-EntityToTable -EnvironmentName $envName -EnvironmentConfig $envConfig -EntityData $TEST_ENTITY) {
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
