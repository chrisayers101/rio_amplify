// Feasibility Study Section Status Enum
export type FeasibilityStudySectionStatus = 'not_started' | 'in_progress' | 'complete';

// Base interfaces for nested data
export interface Issue {
  id: string;
  description: string;
  status: string;
  source: string;
}

export interface Observation {
  id: string;
  text: string;
  source: string;
  changeOccurred: boolean;
}

export interface SubSectionAssessment {
  quality: string;
  consistency: string;
  contradictions: string;
  gaps: string;
  guidelineReference: string;
}

export interface SubSectionObservation {
  note: string;
  source: string;
  changeDetected: boolean;
}

export interface SubSectionDecision {
  date: string;
  original: string;
  revised: string;
  reason: string;
  source: string;
}

export interface SubSection {
  subSectionId: string;
  subSectionTitle: string;
  percentComplete: number;
  content: Record<string, unknown>; // Flexible content structure
  assessment: SubSectionAssessment;
  observations: SubSectionObservation[];
  decisions: SubSectionDecision[];
}

// Main section entity interface (what goes in the 'entity' field)
export interface FeasibilityStudySectionEntity {
  sectionName: string;
  qualityRating?: string;
  assessment?: string;  // Markdown string
  content?: Record<string, unknown>; // Flexible content structure
  issues?: string;  // Markdown string instead of array
  observations?: string;  // Markdown string instead of array
  subSections?: SubSection[];
}

// Main DynamoDB table record interface
export interface FeasibilityStudySection {
  projectId: string;
  sectionId: string;
  percentComplete: number;
  status: FeasibilityStudySectionStatus;
  entity: string;  // JSON string as stored in DynamoDB
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Project metadata interface
export interface ProjectMetadata {
  name: string;
  location: string;
  status: string;
  version: string;
  lastUpdated: string;
}

// Complete feasibility study view interface
export interface FeasibilityStudyView {
  feasibilityStudyView: {
    projectMetadata: ProjectMetadata;
    sections: FeasibilityStudySectionEntity[];
  };
}

// Utility type for creating new sections
export type CreateFeasibilityStudySectionInput = Omit<FeasibilityStudySection, 'projectId' | 'sectionId'> & {
  projectId: string;
  sectionId: string;
};

// Utility type for updating sections
export type UpdateFeasibilityStudySectionInput = Partial<Omit<FeasibilityStudySection, 'projectId' | 'sectionId'>> & {
  projectId: string;
  sectionId: string;
};
