import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import guidelinesData from '@/mockdata/guidelines_markdown.json'

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

export const useGuidelinesStore = defineStore('guidelines', () => {
  // State
  const sections = ref<GuidelineSection[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedSectionId = ref<number | null>(null)

  // Computed
  const sectionCount = computed(() => sections.value.length)
  const hasSections = computed(() => sections.value.length > 0)
  const selectedSection = computed(() =>
    sections.value.find(section => section.id === selectedSectionId.value) || null
  )

  // Get section by ID
  const getSectionById = (id: number): GuidelineSection | undefined => {
    return sections.value.find(section => section.id === id)
  }

  // Get section by name (case-insensitive)
  const getSectionByName = (name: string): GuidelineSection | undefined => {
    return sections.value.find(section =>
      section.sectionName.toLowerCase().includes(name.toLowerCase())
    )
  }

  // Get sections by partial name match
  const getSectionsByPartialName = (partialName: string): GuidelineSection[] => {
    return sections.value.filter(section =>
      section.sectionName.toLowerCase().includes(partialName.toLowerCase())
    )
  }

  // Get sections by ID range
  const getSectionsByIdRange = (startId: number, endId: number): GuidelineSection[] => {
    return sections.value.filter(section =>
      section.id >= startId && section.id <= endId
    )
  }

  // Get sections by category (based on ID ranges)
  const getSectionsByCategory = (category: 'summary' | 'business' | 'technical' | 'execution' | 'analysis'): GuidelineSection[] => {
    const categoryRanges = {
      summary: [1, 1],      // Summary & Recommendations
      business: [2, 9],     // Business Strategy through Tax, Legal & Commercial
      technical: [10, 22],  // Permits & Approvals through New Technologies
      execution: [23, 26],  // Project Execution through Closure
      analysis: [27, 30]    // Cost Estimation through Next Study Stage
    }

    const [startId, endId] = categoryRanges[category]
    return getSectionsByIdRange(startId, endId)
  }

  // Actions
  const loadGuidelines = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate async loading (in real app, this might be an API call)
      await new Promise(resolve => setTimeout(resolve, 100))

      // Load data from the JSON file
      sections.value = guidelinesData as GuidelineSection[]

      console.log('✅ Guidelines Store - Loaded guidelines successfully:', sections.value.length, 'sections')
    } catch (err) {
      console.error('Error loading guidelines:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load guidelines'
    } finally {
      isLoading.value = false
    }
  }

  const setSelectedSection = (sectionId: number | null): void => {
    selectedSectionId.value = sectionId
  }

  const selectSectionById = (id: number): void => {
    const section = getSectionById(id)
    if (section) {
      selectedSectionId.value = id
      error.value = null
    } else {
      error.value = 'Section not found'
    }
  }

  const selectSectionByName = (name: string): void => {
    const section = getSectionByName(name)
    if (section) {
      selectedSectionId.value = section.id
      error.value = null
    } else {
      error.value = 'Section not found'
    }
  }

  const clearSelection = (): void => {
    selectedSectionId.value = null
  }

  const clearError = (): void => {
    error.value = null
  }

  const clearSections = (): void => {
    sections.value = []
    selectedSectionId.value = null
    error.value = null
  }

  // Initialize guidelines loading
  const initializeGuidelines = async (): Promise<void> => {
    await loadGuidelines()
  }

  return {
    // State
    sections: readonly(sections),
    isLoading: readonly(isLoading),
    error: readonly(error),
    selectedSectionId: readonly(selectedSectionId),

    // Computed
    sectionCount,
    hasSections,
    selectedSection,

    // Getters
    getSectionById,
    getSectionByName,
    getSectionsByPartialName,
    getSectionsByIdRange,
    getSectionsByCategory,

    // Actions
    loadGuidelines,
    setSelectedSection,
    selectSectionById,
    selectSectionByName,
    clearSelection,
    clearError,
    clearSections,
    initializeGuidelines
  }
})
