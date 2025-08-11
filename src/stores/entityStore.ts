import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth'
import type { FeasibilityStudySection, FeasibilityStudySectionStatus } from '@/types/feasibilityStudy'

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

// Type for our feasibility study sections
export interface FeasibilityStudySectionEntity extends FeasibilityStudySection {
  createdAt?: string | null
  updatedAt?: string | null
}

export interface FeasibilityStudySectionState {
  sections: FeasibilityStudySectionEntity[]
  isLoading: boolean
  error: string | null
  selectedSections: FeasibilityStudySectionEntity[]
}

export const useFeasibilityStudySectionStore = defineStore('feasibilityStudySection', () => {
  // State
  const sections = ref<FeasibilityStudySectionEntity[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedSections = ref<FeasibilityStudySectionEntity[]>([])

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

  // Getters
  const getSection = (projectId: string, sectionId: string) => {
    return sections.value.find(s => s.projectId === projectId && s.sectionId === sectionId)
  }

  // Get parsed entity for a section
  const getParsedEntity = (projectId: string, sectionId: string) => {
    const section = getSection(projectId, sectionId)
    if (section && section.entity) {
      try {
        const firstParse = JSON.parse(section.entity)
        return typeof firstParse === 'string' ? JSON.parse(firstParse) : firstParse
      } catch (error) {
        console.error('Failed to parse entity:', error)
        return null
      }
    }
    return null
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

      sections.value = sectionsList
      console.log('=== ENTITY STORE DATA LOADED ===')
      console.log('Total sections loaded:', sectionsList.length)
      console.log('First section:', sectionsList[0])
      if (sectionsList[0] && sectionsList[0].entity) {
        console.log('First section entity:', sectionsList[0].entity)
        console.log('Entity keys:', Object.keys(JSON.parse(sectionsList[0].entity)))
        console.log('Entity type:', typeof sectionsList[0].entity)
      }
      console.log('All sections:', sectionsList)
      console.log('=== END ENTITY STORE DATA ===')

      // NEW: Parse and replace entities in the sections array
      console.log('=== PARSING AND REPLACING ENTITIES ===')
      sections.value = sectionsList.map((section: any) => {
        if (section.entity) {
          try {
            const firstParse = JSON.parse(section.entity)
            const parsedEntity = typeof firstParse === 'string' ? JSON.parse(firstParse) : firstParse
            console.log(`Parsed entity for ${section.sectionId}:`, parsedEntity)
            return {
              ...section,
              entity: parsedEntity  // Replace string with parsed object
            }
          } catch (error) {
            console.error(`Failed to parse entity for section ${section.sectionId}:`, error)
            return section
          }
        }
        return section
      })
      console.log('=== ENTITIES PARSED AND REPLACED ===')

      // NEW: Log the complete parsed entity data
      console.log('=== PARSED ENTITY DATA ===')
      sections.value.forEach((section: any, index: number) => {
        if (section.entity) {
          console.log(`Section ${index + 1} (${section.sectionId}) parsed entity:`, section.entity)
          console.log(`Section ${index + 1} (${section.sectionId}) parsed entity type:`, typeof section.entity)
          console.log(`Section ${index + 1} (${section.sectionId}) entity keys:`, Object.keys(section.entity))

          console.log(`Section ${index + 1} (${section.sectionId}):`, {
            projectId: section.projectId,
            sectionId: section.sectionId,
            percentComplete: section.percentComplete,
            status: section.status,
            parsedEntity: section.entity,
            entityKeys: Object.keys(section.entity)
          })
        }
      })
      console.log('=== END PARSED ENTITY DATA ===')

      // NEW: Log the entire store state
      console.log('=== COMPLETE ENTITY STORE STATE ===')
      console.log('Store sections array:', sections.value)
      console.log('Store sections length:', sections.value.length)
      console.log('Store sections loaded successfully')
      console.log('=== END COMPLETE ENTITY STORE STATE ===')
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

      // Update sections for this project
      const otherSections = sections.value.filter(s => s.projectId !== projectId)
      sections.value = [...otherSections, ...sectionsList]
      console.log('Project sections loaded:', sectionsList)
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
  ): Promise<FeasibilityStudySectionEntity | null> => {
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

      // Add to local state
      sections.value.push(newSection)

      return newSection
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
  ): Promise<FeasibilityStudySectionEntity | null> => {
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

      // Update in local state
      const index = sections.value.findIndex(s => s.projectId === projectId && s.sectionId === sectionId)
      if (index !== -1) {
        sections.value[index] = updatedSection
      }

      return updatedSection
    } catch (err) {
      console.error('Error updating section:', err)
      error.value = err instanceof Error ? err.message : 'Failed to update section'
      return null
    } finally {
      isLoading.value = false
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

  const getSectionById = (projectId: string, sectionId: string): FeasibilityStudySectionEntity | undefined => {
    return sections.value.find(section => section.projectId === projectId && section.sectionId === sectionId)
  }

  const clearError = (): void => {
    error.value = null
  }

  const clearSections = (): void => {
    sections.value = []
    error.value = null
  }

  const setSelectedSections = (sections: readonly any[]): void => {
    selectedSections.value = [...sections]
  }

  const clearSelectedSections = (): void => {
    selectedSections.value = []
  }

  const addSelectedSection = (section: FeasibilityStudySectionEntity): void => {
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
    sections: readonly(sections),
    isLoading: readonly(isLoading),
    error: readonly(error),
    selectedSections: readonly(selectedSections),

    // Computed
    sectionCount,
    hasSections,
    selectedSectionCount,
    hasSelectedSections,
    getSectionsByProject,
    getSectionsByStatus,

    // Getters
    getSection,
    getParsedEntity,

    // Actions
    fetchSections,
    fetchSectionsByProject,
    createSection,
    updateSection,
    deleteSection,
    getSectionById,
    clearError,
    clearSections,
    setSelectedSections,
    clearSelectedSections,
    addSelectedSection,
    removeSelectedSection
  }
})
