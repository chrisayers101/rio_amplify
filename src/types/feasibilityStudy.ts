// Feasibility Study Section Status Enum
export type FeasibilityStudySectionStatus = 'not_started' | 'in_progress' | 'complete';

// Main section entity interface (what goes in the 'entity' field)
export interface FeasibilityStudySectionEntity {
  assessment?: string;  // Markdown string
  content?: string; // Markdown string content
  issues?: string;  // Markdown string instead of array
  observations?: string;  // Markdown string instead of array
  [key: string]: unknown; // Allow dynamic property access
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
