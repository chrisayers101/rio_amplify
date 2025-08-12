export interface GuidelineSection {
  id: number
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
  summary: [number, number]      // Summary & Recommendations
  business: [number, number]     // Business Strategy through Tax, Legal & Commercial
  technical: [number, number]    // Permits & Approvals through New Technologies
  execution: [number, number]    // Project Execution through Closure
  analysis: [number, number]     // Cost Estimation through Next Study Stage
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
