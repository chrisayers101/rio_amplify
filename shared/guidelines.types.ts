// ============================================================================
// GUIDELINES INTERFACES
// ============================================================================

export interface GuidelineSection {
  id: string
  sectionName: string
  markdown: string
}

export interface GuidelinesState {
  sections: GuidelineSection[]
  isLoading: boolean
  error: string | null
  selectedSectionId: number | null
}

export type GuidelineCategory = 'summary' | 'business' | 'technical' | 'execution' | 'analysis'

export interface GuidelineCategoryRanges {
  summary: [string, string]      // Summary & Recommendations
  business: [string, string]     // Business Strategy through Tax, Legal & Commercial
  technical: [string, string]    // Permits & Approvals through New Technologies
  execution: [string, string]    // Project Execution through Closure
  analysis: [string, string]     // Cost Estimation through Next Study Stage
}

export interface GuidelineSearchResult {
  section: GuidelineSection
  relevanceScore: number
  matchedFields: string[]
}

export interface GuidelineFilterOptions {
  category?: GuidelineCategory
  searchTerm?: string
  minId?: number
  maxId?: number
}
