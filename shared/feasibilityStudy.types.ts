// ============================================================================
// FEASIBILITY STUDY INTERFACES
// ============================================================================

// Feasibility Study Section Status Enum
export type FeasibilityStudySectionStatus = 'not_started' | 'in_progress' | 'complete';

// Main section entity interface (what goes in the 'entity' field)
export interface FeasibilityStudySectionEntity {
    content: string; // Markdown string content
    qualityAssessment: string;  // Markdown string
    [key: string]: string | undefined; // Index signature for dynamic access
}

// Main DynamoDB table record interface (raw from database)
export interface FeasibilityStudySection {
  projectId: string;
  sectionId: string;
  sectionName: string;
  percentComplete: number;
  status: FeasibilityStudySectionStatus;
  qualityRating: string;
  entity: FeasibilityStudySectionEntity;  // Always typed entity, no string union
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Parsed section interface for use in the application
export interface ParsedFeasibilityStudySection extends Omit<FeasibilityStudySection, 'entity'> {
  entity: FeasibilityStudySectionEntity;  // Parsed and typed entity
}
