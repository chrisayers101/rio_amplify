import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth'
import type {
  FeasibilityStudySection,
  FeasibilityStudySectionStatus,
  ParsedFeasibilityStudySection,
  FeasibilityStudySectionEntity
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
  const selectedSection = computed(() => selectedSections.value[0] ?? null)

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
        // The entity string appears to be double-encoded, so we need to parse it twice
        let parsedString = rawEntity
        // Remove outer quotes if they exist
        if (parsedString.startsWith('"') && parsedString.endsWith('"')) {
          parsedString = parsedString.slice(1, -1)
        }

        // More comprehensive unescaping to handle all control characters
        parsedString = parsedString
          .replace(/\\"/g, '"')           // Unescape quotes
          .replace(/\\\\n/g, '\n')        // Unescape newlines
          .replace(/\\\\t/g, '\t')        // Unescape tabs
          .replace(/\\\\r/g, '\r')        // Unescape carriage returns
          .replace(/\\\\/g, '\\')         // Unescape backslashes

        // The content contains actual newlines that need to be escaped for JSON parsing
        // We need to escape newlines, tabs, and other control characters in the content
        parsedString = parsedString
          .replace(/\n/g, '\\n')          // Escape actual newlines
          .replace(/\t/g, '\\t')          // Escape actual tabs
          .replace(/\r/g, '\\r')          // Escape actual carriage returns

        entityObject = JSON.parse(parsedString)
      } catch (error) {
        console.error('Failed to parse JSON string:', error)

        return { sectionName: 'Unknown Section' }
      }
    } else if (typeof rawEntity === 'object' && rawEntity !== null) {
      entityObject = rawEntity
    } else {

      return { sectionName: 'Unknown Section' }
    }



    // Only include fields that actually exist in the original data
    const parsedEntity: FeasibilityStudySectionEntity = {}

    if (entityObject.assessment) {
      parsedEntity.assessment = entityObject.assessment as string
    }
    if (entityObject.qualityAssessment) {
      parsedEntity.qualityAssessment = entityObject.qualityAssessment as string
    }
    if (entityObject.content) {
      parsedEntity.content = entityObject.content as string
    }
    if (entityObject.issues) {
      parsedEntity.issues = entityObject.issues as string
    }
    if (entityObject.observations) {
      parsedEntity.observations = entityObject.observations as string
    }



    return parsedEntity
  }

  // Utility functions for formatting and display
  const getSectionDisplayName = (section: ParsedFeasibilityStudySection): string => {
    // Use the sectionName field if available
    if (section.sectionName) {
      return `${section.sectionId}: ${section.sectionName}`
    }

    // Fallback to extracting from content if sectionName is not available
    if (section.entity && typeof section.entity === 'object' && section.entity.content) {
      const content = section.entity.content as string
      // Extract section name from the first heading (e.g., "# Executive Summary" -> "Executive Summary")
      const headingMatch = content.match(/^#\s+(.+)$/m)
      if (headingMatch) {
        return `${section.sectionId}: ${headingMatch[1].trim()}`
      }
    }

    // Final fallback
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
        console.error('Full error details:', JSON.stringify(errors, null, 2))
        error.value = 'Failed to fetch sections'
        return
      }

      // Parse and validate all sections

      sections.value = sectionsList.map((section: FeasibilityStudySection) => {

        const parsedEntity = parseEntityData(section.entity)

        // Use the parsed entity directly since it only contains fields that exist
        const finalEntity = parsedEntity

        return {
          ...section,
          entity: finalEntity
        } as ParsedFeasibilityStudySection
      })

      // Log the loaded sections
      console.log(`[EntityStore] Loaded ${sections.value.length} sections:`, sections.value.map((s: ParsedFeasibilityStudySection) => ({ projectId: s.projectId, sectionId: s.sectionId, status: s.status })))

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

      const { data: sectionsList, errors } = await getClient().models.FeasibilityStudySections.list({
        filter: {
          projectId: { eq: projectId }
        }
      })

      if (errors) {
        console.error('Errors fetching project sections:', errors)
        console.error('Full error details:', JSON.stringify(errors, null, 2))
        error.value = 'Failed to fetch project sections'
        return
      }

      // Parse and validate project sections
      const parsedProjectSections = sectionsList.map((section: FeasibilityStudySection) => {
        const parsedEntity = parseEntityData(section.entity)

        // Use the parsed entity directly since it only contains fields that exist
        const finalEntity = parsedEntity

        return {
          ...section,
          entity: finalEntity
        } as ParsedFeasibilityStudySection
      })

      // Update sections for this project
      const otherSections = sections.value.filter(s => s.projectId !== projectId)
      sections.value = [...otherSections, ...parsedProjectSections]

      // Log the loaded project sections
      console.log(`[EntityStore] Loaded ${parsedProjectSections.length} sections for project ${projectId}:`, parsedProjectSections.map((s: ParsedFeasibilityStudySection) => ({ sectionId: s.sectionId, status: s.status })))
      console.log(`[EntityStore] Total sections in store: ${sections.value.length}`)

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

      const { data: updatedSection, errors } = await getClient().models.FeasibilityStudySections.update({
        projectId,
        sectionId,
        ...updates
      })

      if (errors) {
        console.error('Errors updating section:', errors)
        console.error('Full error details:', JSON.stringify(errors, null, 2))
        error.value = 'Failed to update section'
        return null
      }

      if (!updatedSection) {
        error.value = 'Failed to update section'
        return null
      }



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

      // Keep selectedSections in sync to avoid stale object references
      const isSelected = selectedSections.value.some(s => s.projectId === projectId && s.sectionId === sectionId)
      if (isSelected) {
        selectedSections.value = [parsedSection]
        // Log the selected entity after update for debugging
        try {
          console.log('[EntityStore] Selected entity after updateSection:', {
            projectId,
            sectionId,
            entityKeys: Object.keys(selectedSections.value[0]?.entity || {}),
            entitySample: selectedSections.value[0]?.entity
          })
        } catch (_) {
          // no-op
        }
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


      // Convert entity object to JSON string for DynamoDB
      const entityJsonString = JSON.stringify(updatedEntity)


      // Update the section with the new entity (as JSON string)
      const result = await updateSection(projectId, sectionId, { entity: entityJsonString })

      // Log selected entity after update for debugging
      try {
        const selected = selectedSections.value[0]
        if (selected && selected.projectId === projectId && selected.sectionId === sectionId) {
          console.log('[EntityStore] Selected entity after updateSectionEntity:', {
            projectId,
            sectionId,
            updatedField: fieldName,
            entityKeys: Object.keys(selected.entity || {}),
            entitySample: selected.entity
          })
        }
      } catch (_) {
        // no-op
      }

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

      const { errors } = await getClient().models.FeasibilityStudySections.delete({
        projectId,
        sectionId
      })

      if (errors) {
        console.error('Errors deleting section:', errors)
        error.value = 'Failed to delete section'
        return false
      }



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
    // Enforce single selection: keep only the first item if provided
    selectedSections.value = sections.length > 0 ? [sections[0]] : []
  }

  const clearSelectedSections = (): void => {
    selectedSections.value = []
  }

  const addSelectedSection = (section: ParsedFeasibilityStudySection): void => {
    // Enforce single selection by replacing any existing selection
    selectedSections.value = [section]
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
    selectedSection,
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
