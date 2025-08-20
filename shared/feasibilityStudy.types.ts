// ============================================================================
// FEASIBILITY STUDY INTERFACES
// ============================================================================

// Feasibility Study Section Status Enum
export type FeasibilityStudySectionStatus = 'not_started' | 'in_progress' | 'complete';

// Quality Rating Enum
export type FeasibilityStudyQualityRating = 'Unrated' | 'Poor' | 'Fair' | 'Good' | 'Excellent';

// Main section entity interface (what goes in the 'entity' field)
export interface FeasibilityStudySectionEntity {
    content: string; // Markdown string content
    qualityAssessment: string;  // Markdown string
    percentComplete: number; // Progress percentage (0-100)
    status: FeasibilityStudySectionStatus; // Section status
    qualityRating: FeasibilityStudyQualityRating; // Quality assessment rating
    [key: string]: string | number | undefined; // Index signature for dynamic access
}

// Main DynamoDB table record interface (raw from database)
export interface FeasibilityStudySection {
  projectId: string;
  sectionId: string;
  sectionName: string;
  entity: FeasibilityStudySectionEntity;  // Always typed entity, no string union
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Parsed section interface for use in the application
export interface ParsedFeasibilityStudySection extends Omit<FeasibilityStudySection, 'entity'> {
  entity: FeasibilityStudySectionEntity;  // Parsed and typed entity
}
