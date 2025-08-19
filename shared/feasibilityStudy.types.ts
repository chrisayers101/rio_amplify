// ============================================================================
// FEASIBILITY STUDY INTERFACES
// ============================================================================

// Feasibility Study Section Status Enum
export type FeasibilityStudySectionStatus = 'not_started' | 'in_progress' | 'complete';

// Main section entity interface (what goes in the 'entity' field)
export interface FeasibilityStudySectionEntity {
    content: string; // Markdown string content
    qualityAssessment: string;  // Markdown string
}

// Main DynamoDB table record interface (raw from database)
export interface FeasibilityStudySection {
  projectId: string;
  sectionId: string;
  sectionName: string;
  percentComplete: number;
  status: FeasibilityStudySectionStatus;
  qualityRating: string;
  entity: Record<string, unknown> | string;  // Can be JSON object or JSON string
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Parsed section interface for use in the application
export interface ParsedFeasibilityStudySection extends Omit<FeasibilityStudySection, 'entity'> {
  entity: FeasibilityStudySectionEntity;  // Parsed and typed entity
}
