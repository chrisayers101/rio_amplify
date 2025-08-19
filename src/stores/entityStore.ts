import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth'
import type {
  FeasibilityStudySection,
  ParsedFeasibilityStudySection,
  FeasibilityStudySectionEntity
} from '../../shared/feasibilityStudy.types'

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

export const useFeasibilityStudySectionStore = defineStore('feasibilityStudySection', () => {
  // State
  const sections = ref<ParsedFeasibilityStudySection[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedSections = ref<ParsedFeasibilityStudySection[]>([])

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

  // Utility functions for formatting and display
  const getSectionDisplayName = (section: ParsedFeasibilityStudySection): string => {
    return section.sectionName ? `${section.sectionId}: ${section.sectionName}` : `Section ${section.sectionId}`
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
      sections.value = sectionsList.map((section: FeasibilityStudySection) => ({
        ...section,
        entity: typeof section.entity === 'string' ? JSON.parse(section.entity) : section.entity
      } as ParsedFeasibilityStudySection))

      // Log the loaded sections
      console.log(`[EntityStore] Loaded ${sections.value.length} sections:`, sections.value.map((s: ParsedFeasibilityStudySection) => ({ projectId: s.projectId, sectionId: s.sectionId, status: s.status })))
      console.log(`[EntityStore] Full sections data:`, JSON.stringify(sections.value, null, 2))

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
      const parsedProjectSections = sectionsList.map((section: FeasibilityStudySection) => ({
        ...section,
        entity: typeof section.entity === 'string' ? JSON.parse(section.entity) : section.entity
      } as ParsedFeasibilityStudySection))

      // Update sections for this project
      const otherSections = sections.value.filter(s => s.projectId !== projectId)
      sections.value = [...otherSections, ...parsedProjectSections]

      // Log the loaded project sections
      console.log(`[EntityStore] Loaded ${parsedProjectSections.length} sections for project ${projectId}:`, parsedProjectSections.map((s: ParsedFeasibilityStudySection) => ({ sectionId: s.sectionId, status: s.status })))
      console.log(`[EntityStore] Full project sections data:`, JSON.stringify(parsedProjectSections, null, 2))
      console.log(`[EntityStore] Total sections in store: ${sections.value.length}`)

    } catch (err) {
      console.error('Error loading project sections:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load project sections'
    } finally {
      isLoading.value = false
    }
  }

  // Simplified method for updating specific entity fields
  const updateSectionEntity = async (
    projectId: string,
    sectionId: string,
    fieldName: string,
    newValue: string
  ): Promise<boolean> => {
    if (!(await checkAuthentication())) return false

    // Validate field name
    if (!['content', 'qualityAssessment'].includes(fieldName)) {
      error.value = `Invalid field name: ${fieldName}`
      return false
    }

    try {
      // Get the current section
      const currentSection = sections.value.find(s => s.projectId === projectId && s.sectionId === sectionId)
      if (!currentSection) {
        error.value = 'Section not found'
        return false
      }

      // Create updated entity with the new value
      const updatedEntity: FeasibilityStudySectionEntity = {
        content: fieldName === 'content' ? newValue : currentSection.entity.content,
        qualityAssessment: fieldName === 'qualityAssessment' ? newValue : currentSection.entity.qualityAssessment
      }

      console.log(`[EntityStore] 🔍 Updated entity:`, {
        keys: Object.keys(updatedEntity),
        hasContent: !!updatedEntity.content,
        hasQualityAssessment: !!updatedEntity.qualityAssessment,
        contentLength: updatedEntity.content?.length || 0,
        qualityAssessmentLength: updatedEntity.qualityAssessment?.length || 0
      })

      // Update the section using Amplify Data
      // Convert entity object to JSON string for database storage
      const { data: updatedSection, errors } = await getClient().models.FeasibilityStudySections.update({
        projectId,
        sectionId,
        entity: JSON.stringify(updatedEntity)
      })

      if (errors) {
        console.error('Errors updating section entity:', errors)
        error.value = 'Failed to update section entity'
        return false
      }

      if (!updatedSection) {
        error.value = 'Failed to update section entity'
        return false
      }

      // Update in local state
      const updatedSectionData: ParsedFeasibilityStudySection = {
        ...updatedSection,
        entity: typeof updatedSection.entity === 'string' ? JSON.parse(updatedSection.entity) : updatedSection.entity
      }

      const index = sections.value.findIndex(s => s.projectId === projectId && s.sectionId === sectionId)
      if (index !== -1) {
        sections.value[index] = updatedSectionData
      }

      // Keep selectedSections in sync
      const isSelected = selectedSections.value.some(s => s.projectId === projectId && s.sectionId === sectionId)
      if (isSelected) {
        selectedSections.value = [updatedSectionData]
      }

      console.log('[EntityStore] Database update result: success')
      return true
    } catch (err) {
      console.error('Error updating section entity:', err)
      error.value = err instanceof Error ? err.message : 'Failed to update section entity'
      return false
    }
  }

  const setSelectedSections = async (selectedSectionsList: readonly ParsedFeasibilityStudySection[]): Promise<void> => {
    console.log(`[EntityStore] 🔄 setSelectedSections called with ${selectedSectionsList.length} sections`)
    console.log(`[EntityStore] 📋 Sections:`, selectedSectionsList.map(s => ({ sectionId: s.sectionId, sectionName: s.sectionName })))

    // Enforce single selection: keep only the first item if provided
    selectedSections.value = selectedSectionsList.length > 0 ? [selectedSectionsList[0]] : []

    if (selectedSectionsList.length > 0) {
      const section = selectedSectionsList[0]
      console.log(`[EntityStore] 🎯 Section selected: ${section.sectionId} (${section.sectionName || 'Unnamed'})`)
      console.log(`[EntityStore] 📊 Current section data:`, {
        projectId: section.projectId,
        sectionId: section.sectionId,
        percentComplete: section.percentComplete,
        status: section.status,
        hasContent: !!section.entity?.content,
        hasQualityAssessment: !!section.entity?.qualityAssessment,
        contentLength: section.entity?.content?.length || 0
      })

      // Add detailed entity logging
      if (section.entity) {
        console.log(`[EntityStore] 🔍 SELECTED ENTITY DETAILS:`, {
          entityType: typeof section.entity,
          entityKeys: Object.keys(section.entity),
          entityContent: section.entity.content,
          entityQualityAssessment: section.entity.qualityAssessment,
          contentLength: section.entity.content?.length || 0,
          qualityAssessmentLength: section.entity.qualityAssessment?.length || 0,
          fullEntityObject: JSON.stringify(section.entity, null, 2)
        })
      } else {
        console.log(`[EntityStore] ⚠️ No entity found for selected section`)
      }

      // Log the full section object to see what's actually there
      console.log(`[EntityStore] 🔍 FULL SELECTED SECTION OBJECT:`, {
        sectionId: section.sectionId,
        sectionName: section.sectionName,
        projectId: section.projectId,
        percentComplete: section.percentComplete,
        status: section.status,
        entity: section.entity,
        entityType: typeof section.entity,
        entityKeys: section.entity ? Object.keys(section.entity) : 'NO_ENTITY',
        rawSection: JSON.stringify(section, null, 2)
      })

      // Log the store state to see what sections are loaded
      console.log(`[EntityStore] 📚 STORE STATE:`, {
        totalSections: sections.value.length,
        selectedSectionsCount: selectedSections.value.length,
        storeSections: sections.value.map((s: ParsedFeasibilityStudySection) => ({
          sectionId: s.sectionId,
          sectionName: s.sectionName,
          hasEntity: !!s.entity,
          entityType: typeof s.entity,
          entityKeys: s.entity ? Object.keys(s.entity) : 'NO_ENTITY'
        }))
      })
                } else {
                  console.log(`[EntityStore] ℹ️ No sections provided, clearing selection`)
                }
}

return {
// State
sections: sections,
isLoading: isLoading,
error: error,
selectedSections: selectedSections,

// Actions
fetchSections,
fetchSectionsByProject,
updateSectionEntity,
setSelectedSections,

// Utility functions
getSectionDisplayName,
formatStatus,
getStatusClass,
formatTabName,
    formatPropertyName
}
})
