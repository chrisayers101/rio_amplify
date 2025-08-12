import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth'
import type {
  FeasibilityStudySection,
  FeasibilityStudySectionStatus,
  ParsedFeasibilityStudySection,
  FeasibilityStudySectionEntity,
  SubSection
} from '@/types/feasibilityStudy'

// Lazy initialization of Amplify Data client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any = null

const getClient = () => {
  if (!client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client = generateClient() as any
    } catch (error) {
      console.error('Failed to initialize Amplify client:', error)
      throw new Error('Amplify has not been configured. Please call Amplify.configure() before using this service.')
    }
  }
  return client
}

export interface FeasibilityStudySectionState {
  sections: ParsedFeasibilityStudySection[]
  isLoading: boolean
  error: string | null
  selectedSections: ParsedFeasibilityStudySection[]
}

export const useFeasibilityStudySectionStore = defineStore('feasibilityStudySection', () => {
  // State
  const sections = ref<ParsedFeasibilityStudySection[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedSections = ref<ParsedFeasibilityStudySection[]>([])

  // Computed
  const sectionCount = computed(() => sections.value.length)
  const hasSections = computed(() => sections.value.length > 0)
  const selectedSectionCount = computed(() => selectedSections.value.length)
  const hasSelectedSections = computed(() => selectedSections.value.length > 0)

  // Get sections by project
  const getSectionsByProject = computed(() => (projectId: string) => {
    return sections.value.filter(section => section.projectId === projectId)
  })

  // Get sections by status
  const getSectionsByStatus = computed(() => (status: FeasibilityStudySectionStatus) => {
    return sections.value.filter(section => section.status === status)
  })

  // Consolidated getter function - single source of truth
  const getSection = (projectId: string, sectionId: string): ParsedFeasibilityStudySection | undefined => {
    return sections.value.find(s => s.projectId === projectId && s.sectionId === sectionId)
  }

  // Get entity for a section (now directly accessible as typed object)
  const getEntity = (projectId: string, sectionId: string): FeasibilityStudySectionEntity | null => {
    const section = getSection(projectId, sectionId)
    return section?.entity || null
  }

  // Helper function to check authentication
  const checkAuthentication = async (): Promise<boolean> => {
    try {
      await getCurrentUser()
      return true
    } catch {
      console.log('User not authenticated for feasibility study section operations')
      error.value = 'Authentication required'
      return false
    }
  }

  // Helper function to parse and validate entity data
  const parseEntityData = (rawEntity: Record<string, unknown> | string): FeasibilityStudySectionEntity => {
    let entityObject: Record<string, unknown>

    // Handle case where entity is a JSON string
    if (typeof rawEntity === 'string') {
      try {
        entityObject = JSON.parse(rawEntity)
      } catch (error) {
        console.error('Failed to parse JSON string:', error)
        return { sectionName: 'Unknown Section' }
      }
    } else if (typeof rawEntity === 'object' && rawEntity !== null) {
      entityObject = rawEntity
    } else {
      return { sectionName: 'Unknown Section' }
    }

    // Ensure required fields exist with defaults
    const parsedEntity = {
      sectionName: (entityObject.sectionName as string) || 'Unknown Section',
      qualityRating: (entityObject.qualityRating as string) || undefined,
      assessment: (entityObject.assessment as string) || undefined,
      content: (entityObject.content as Record<string, unknown>) || undefined,
      issues: (entityObject.issues as string) || undefined,
      observations: (entityObject.observations as string) || undefined,
      subSections: (entityObject.subSections as SubSection[]) || undefined,
    }

    return parsedEntity
  }

  // Utility functions for formatting and display
  const getSectionDisplayName = (section: ParsedFeasibilityStudySection): string => {
    if (section.entity && typeof section.entity === 'object' && 'sectionName' in section.entity) {
      return section.entity.sectionName as string
    }
    return `Section ${section.sectionId}`
  }

  const formatStatus = (status: string): string => {
    switch (status) {
      case 'complete':
        return 'Complete'
      case 'in_progress':
        return 'In Progress'
      case 'not_started':
        return 'Not Started'
      default:
        return status
    }
  }

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'complete':
        return 'status-complete'
      case 'in_progress':
        return 'status-in-progress'
      case 'not_started':
        return 'status-not-started'
      default:
        return 'status-unknown'
    }
  }

  const formatTabName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim()
  }

  const formatPropertyName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim()
  }

  const getCompletionStatus = (percentage: number): string => {
    if (percentage >= 90) return 'excellent'
    if (percentage >= 80) return 'good'
    if (percentage >= 70) return 'moderate'
    return 'needs-improvement'
  }

  // Actions
  const fetchSections = async (): Promise<void> => {
    if (!(await checkAuthentication())) return

    isLoading.value = true
    error.value = null

    try {
      const { data: sectionsList, errors } = await getClient().models.FeasibilityStudySections.list({})

      if (errors) {
        console.error('Errors fetching sections:', errors)
        error.value = 'Failed to fetch sections'
        return
      }

      // Parse and validate all sections
      sections.value = sectionsList.map((section: FeasibilityStudySection) => {
        const parsedEntity = parseEntityData(section.entity)
        return {
          ...section,
          entity: parsedEntity
        } as ParsedFeasibilityStudySection
      })

      console.log('✅ Store loaded successfully:', {
        sectionCount: sections.value.length,
        firstSection: sections.value[0] ? {
          id: sections.value[0].sectionId,
          name: sections.value[0].entity.sectionName,
          entityKeys: Object.keys(sections.value[0].entity)
        } : 'No sections'
      })
    } catch (err) {
      console.error('Error loading sections:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load sections'
    } finally {
      isLoading.value = false
    }
  }

  const fetchSectionsByProject = async (projectId: string): Promise<void> => {
    if (!(await checkAuthentication())) return

    isLoading.value = true
    error.value = null

    try {
      console.log('Fetching sections for project:', projectId)
      const { data: sectionsList, errors } = await getClient().models.FeasibilityStudySections.list({
        filter: {
          projectId: { eq: projectId }
        }
      })

      if (errors) {
        console.error('Errors fetching project sections:', errors)
        error.value = 'Failed to fetch project sections'
        return
      }

      // Parse and validate project sections
      const parsedProjectSections = sectionsList.map((section: FeasibilityStudySection) => {
        const parsedEntity = parseEntityData(section.entity)
        return {
          ...section,
          entity: parsedEntity
        } as ParsedFeasibilityStudySection
      })

      // Update sections for this project
      const otherSections = sections.value.filter(s => s.projectId !== projectId)
      sections.value = [...otherSections, ...parsedProjectSections]
      console.log(`Loaded ${parsedProjectSections.length} sections for project ${projectId}`)
    } catch (err) {
      console.error('Error loading project sections:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load project sections'
    } finally {
      isLoading.value = false
    }
  }

  const createSection = async (
    projectId: string,
    sectionId: string,
    percentComplete: number = 0,
    status: FeasibilityStudySectionStatus = 'not_started',
    entity: Record<string, unknown> = {}
  ): Promise<ParsedFeasibilityStudySection | null> => {
    if (!(await checkAuthentication())) return null

    if (!projectId.trim() || !sectionId.trim()) {
      error.value = 'Project ID and Section ID are required'
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      console.log('Creating section:', { projectId, sectionId, percentComplete, status, entity })
      const { data: newSection, errors } = await getClient().models.FeasibilityStudySections.create({
        projectId: projectId.trim(),
        sectionId: sectionId.trim(),
        percentComplete,
        status,
        entity,
      })

      if (errors) {
        console.error('Errors creating section:', errors)
        error.value = 'Failed to create section'
        return null
      }

      if (!newSection) {
        error.value = 'Failed to create section'
        return null
      }

      console.log('Section created:', newSection)

      // Parse and add to local state
      const parsedEntity = parseEntityData(newSection.entity)
      const parsedSection: ParsedFeasibilityStudySection = {
        ...newSection,
        entity: parsedEntity
      }

      sections.value.push(parsedSection)
      return parsedSection
    } catch (err) {
      console.error('Error creating section:', err)
      error.value = err instanceof Error ? err.message : 'Failed to create section'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateSection = async (
    projectId: string,
    sectionId: string,
    updates: Partial<Pick<FeasibilityStudySection, 'percentComplete' | 'status' | 'entity'>>
  ): Promise<ParsedFeasibilityStudySection | null> => {
    if (!(await checkAuthentication())) return null

    isLoading.value = true
    error.value = null

    try {
      console.log('Updating section:', { projectId, sectionId, updates })
      const { data: updatedSection, errors } = await getClient().models.FeasibilityStudySections.update({
        projectId,
        sectionId,
        ...updates
      })

      if (errors) {
        console.error('Errors updating section:', errors)
        error.value = 'Failed to update section'
        return null
      }

      if (!updatedSection) {
        error.value = 'Failed to update section'
        return null
      }

      console.log('Section updated:', updatedSection)

      // Parse and update in local state
      const parsedEntity = parseEntityData(updatedSection.entity)
      const parsedSection: ParsedFeasibilityStudySection = {
        ...updatedSection,
        entity: parsedEntity
      }

      const index = sections.value.findIndex(s => s.projectId === projectId && s.sectionId === sectionId)
      if (index !== -1) {
        sections.value[index] = parsedSection
      }

      return parsedSection
    } catch (err) {
      console.error('Error updating section:', err)
      error.value = err instanceof Error ? err.message : 'Failed to update section'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Consolidated method for updating specific entity fields
  const updateSectionEntity = async (
    projectId: string,
    sectionId: string,
    fieldName: string,
    newValue: string
  ): Promise<boolean> => {
    if (!(await checkAuthentication())) return false

    try {
      // Get the current section
      const currentSection = getSection(projectId, sectionId)
      if (!currentSection) {
        error.value = 'Section not found'
        return false
      }

      // Create updated entity with the new field value
      const updatedEntity = {
        ...currentSection.entity,
        [fieldName]: newValue
      }

      // Update the section with the new entity
      const result = await updateSection(projectId, sectionId, { entity: updatedEntity })
      return result !== null
    } catch (err) {
      console.error('Error updating section entity:', err)
      error.value = err instanceof Error ? err.message : 'Failed to update section entity'
      return false
    }
  }

  const deleteSection = async (projectId: string, sectionId: string): Promise<boolean> => {
    if (!(await checkAuthentication())) return false

    isLoading.value = true
    error.value = null

    try {
      console.log('Deleting section:', { projectId, sectionId })
      const { errors } = await getClient().models.FeasibilityStudySections.delete({
        projectId,
        sectionId
      })

      if (errors) {
        console.error('Errors deleting section:', errors)
        error.value = 'Failed to delete section'
        return false
      }

      console.log('Section deleted successfully')

      // Remove from local state
      sections.value = sections.value.filter(s => !(s.projectId === projectId && s.sectionId === sectionId))

      return true
    } catch (err) {
      console.error('Error deleting section:', err)
      error.value = err instanceof Error ? err.message : 'Failed to delete section'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  const clearSections = (): void => {
    sections.value = []
    error.value = null
  }

  const setSelectedSections = (sections: readonly ParsedFeasibilityStudySection[]): void => {
    selectedSections.value = [...sections]
  }

  const clearSelectedSections = (): void => {
    selectedSections.value = []
  }

  const addSelectedSection = (section: ParsedFeasibilityStudySection): void => {
    if (!selectedSections.value.find(s => s.projectId === section.projectId && s.sectionId === section.sectionId)) {
      selectedSections.value.push(section)
    }
  }

  const removeSelectedSection = (projectId: string, sectionId: string): void => {
    selectedSections.value = selectedSections.value.filter(s =>
      !(s.projectId === projectId && s.sectionId === sectionId)
    )
  }

  return {
    // State
    sections: sections,
    isLoading: isLoading,
    error: error,
    selectedSections: selectedSections,

    // Computed
    sectionCount,
    hasSections,
    selectedSectionCount,
    hasSelectedSections,
    getSectionsByProject,
    getSectionsByStatus,

    // Getters
    getSection,
    getEntity,

    // Actions
    fetchSections,
    fetchSectionsByProject,
    createSection,
    updateSection,
    updateSectionEntity,
    deleteSection,
    clearError,
    clearSections,
    setSelectedSections,
    clearSelectedSections,
    addSelectedSection,
    removeSelectedSection,

    // Utility functions
    getSectionDisplayName,
    formatStatus,
    getStatusClass,
    formatTabName,
    formatPropertyName,
    getCompletionStatus
  }
})
