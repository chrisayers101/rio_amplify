import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import guidelinesData from '@/mockdata/guidelines_markdown.json'
import type {
  GuidelineSection,
  GuidelineCategory,
  GuidelineCategoryRanges,
  GuidelineSearchResult,
  GuidelineFilterOptions
} from '@/types/guidelines'

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
  const getSectionsByCategory = (category: GuidelineCategory): GuidelineSection[] => {
    const categoryRanges: GuidelineCategoryRanges = {
      summary: [1, 1],      // Summary & Recommendations
      business: [2, 9],     // Business Strategy through Tax, Legal & Commercial
      technical: [10, 22],  // Permits & Approvals through New Technologies
      execution: [23, 26],  // Project Execution through Closure
      analysis: [27, 30]    // Cost Estimation through Next Study Stage
    }

    const [startId, endId] = categoryRanges[category]
    return getSectionsByIdRange(startId, endId)
  }

  // Search functionality with relevance scoring
  const searchSections = (searchTerm: string): GuidelineSearchResult[] => {
    if (!searchTerm.trim()) return []

    const results: GuidelineSearchResult[] = []
    const term = searchTerm.toLowerCase()

    sections.value.forEach(section => {
      let relevanceScore = 0
      const matchedFields: string[] = []

      // Check section name (highest weight)
      if (section.sectionName.toLowerCase().includes(term)) {
        relevanceScore += 10
        matchedFields.push('sectionName')
      }

      // Check markdown content (lower weight)
      if (section.markdown.toLowerCase().includes(term)) {
        relevanceScore += 5
        matchedFields.push('markdown')
      }

      // Check for exact matches (bonus points)
      if (section.sectionName.toLowerCase() === term) {
        relevanceScore += 5
      }

      if (relevanceScore > 0) {
        results.push({
          section,
          relevanceScore,
          matchedFields
        })
      }
    })

    // Sort by relevance score (highest first)
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  // Filter sections with multiple criteria
  const filterSections = (options: GuidelineFilterOptions): GuidelineSection[] => {
    let filtered = [...sections.value]

    if (options.category) {
      filtered = getSectionsByCategory(options.category)
    }

    if (options.searchTerm) {
      const searchResults = searchSections(options.searchTerm)
      filtered = filtered.filter(section =>
        searchResults.some(result => result.section.id === section.id)
      )
    }

    if (options.minId !== undefined) {
      filtered = filtered.filter(section => section.id >= options.minId!)
    }

    if (options.maxId !== undefined) {
      filtered = filtered.filter(section => section.id <= options.maxId!)
    }

    return filtered
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

      // Log basic store info
      console.log('📊 Guidelines Store State:', {
        totalSections: sections.value.length,
        isLoading: isLoading.value,
        error: error.value,
        selectedSectionId: selectedSectionId.value
      })

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

    // Search and Filter
    searchSections,
    filterSections,

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
