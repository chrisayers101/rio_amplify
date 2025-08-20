import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth'
import type {
  FeasibilityStudySection,
  ParsedFeasibilityStudySection,
  FeasibilityStudySectionEntity
} from '../../shared/feasibilityStudy.types'
import type { GuidelineAssessmentResponse } from '../../shared/guidelines.types'
import { useGuidelinesStore } from './guidelinesStore'

// Lazy initialization of Amplify Data client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any = null

const getClient = () => {
  if (!client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client = generateClient() as any
    } catch {
      // Failed to initialize Amplify client
      throw new Error('Amplify has not been configured. Please call Amplify.configure() before using this service.')
    }
  }
  return client
}



const findMatchingGuideline = (sectionId: string) => {
  const guidelinesStore = useGuidelinesStore()
  return guidelinesStore.sections.find(g => g.id === sectionId)
}

const runGuidelineAssessment = async (
  content: string,
  guideline: string,
  sectionName: string,
  projectId: string,
  sectionId: string
): Promise<GuidelineAssessmentResponse> => {
  try {
    const { data: result, errors } = await getClient().queries.guidelineAssessment({
      content,
      guideline,
      sectionName,
      projectId,
      sectionId
    })

    if (errors) {
      // Errors calling guideline assessment
      throw new Error('Failed to call guideline assessment')
    }

    if (!result) {
      throw new Error('No result from guideline assessment')
    }

    // The Lambda now returns an object directly, no need to parse JSON
    return result as GuidelineAssessmentResponse
  } catch {
    // Error in runGuidelineAssessment
    throw new Error('Failed to call guideline assessment')
  }
}

export const useFeasibilityStudySectionStore = defineStore('feasibilityStudySection', () => {
  // State
  const sections = ref<ParsedFeasibilityStudySection[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedSections = ref<ParsedFeasibilityStudySection[]>([])
  const isAssessmentRunning = ref(false)

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
        // Errors fetching sections
        error.value = 'Failed to fetch sections'
        return
      }

      // Parse and validate all sections
      sections.value = sectionsList.map((section: FeasibilityStudySection) => ({
        ...section,
        entity: typeof section.entity === 'string' ? JSON.parse(section.entity) : section.entity
      } as ParsedFeasibilityStudySection))

      // Sections loaded successfully

    } catch (err) {
      // Error loading sections
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
        // Errors fetching project sections
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

      // Project sections loaded successfully

    } catch (err) {
      // Error loading project sections
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
    newValue: string | number
  ): Promise<boolean> => {
    if (!(await checkAuthentication())) return false

    // Validate field name
    if (!['content', 'qualityAssessment', 'qualityRating', 'percentComplete'].includes(fieldName)) {
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

      // Create updated entity with the new value, preserving all existing fields
      const updatedEntity: FeasibilityStudySectionEntity = {
        ...currentSection.entity, // Preserve all existing fields
        [fieldName]: newValue // Update only the specified field
      }

      // Entity updated successfully

      // Update the section using Amplify Data
      // Convert entity object to JSON string for database storage
      const { data: updatedSection, errors } = await getClient().models.FeasibilityStudySections.update({
        projectId,
        sectionId,
        entity: JSON.stringify(updatedEntity)
      })

      if (errors) {
        // Errors updating section entity
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
        sections.value = [...sections.value] // Force new array ref for better reactivity
      }

      // Keep selectedSections in sync
      const isSelected = selectedSections.value.some(s => s.projectId === projectId && s.sectionId === sectionId)
      if (isSelected) {
        selectedSections.value = [updatedSectionData]
        // Force new array ref for better reactivity
      }

      // If content was updated, automatically run guideline assessment
      if (fieldName === 'content') {
        console.log(`🔄 [EntityStore] Content updated, triggering automatic guideline assessment...`)
        console.log(`[EntityStore] 📝 Field name: ${fieldName}, Section ID: ${sectionId}, Project ID: ${projectId}`)
        console.log(`[EntityStore] 📊 Updated section data:`, updatedSectionData)
        try {
          console.log(`[EntityStore] 🚀 About to call runAutomaticGuidelineAssessment...`)
          await runAutomaticGuidelineAssessment(updatedSectionData)
          console.log(`[EntityStore] ✅ runAutomaticGuidelineAssessment completed successfully`)
        } catch (error) {
          console.error(`💥 [EntityStore] Error during automatic guideline assessment after content update:`, error)
          // Don't fail the update operation if assessment fails
        }
      } else {
        console.log(`⏭️ [EntityStore] Skipping automatic guideline assessment - fieldName is '${fieldName}', not 'content'`)
      }

      // Database update successful
      return true
    } catch (err) {
      // Error updating section entity
      error.value = err instanceof Error ? err.message : 'Failed to update section entity'
      return false
    }
  }

  /**
   * Runs automatic guideline assessment for a section if needed
   */  async function runAutomaticGuidelineAssessment(section: ParsedFeasibilityStudySection): Promise<void> {
    try {
      // Set loading state
      isAssessmentRunning.value = true

      const matchingGuideline = findMatchingGuideline(section.sectionId)

      if (!matchingGuideline) {
        console.log(`⚠️ [EntityStore] No matching guideline found for section: ${section.sectionId}`)
        console.log(`[EntityStore] This section will not be automatically assessed`)
        return
      }

      console.log(`✅ [EntityStore] Found matching guideline: "${matchingGuideline.sectionName}" (ID: ${matchingGuideline.id})`)
      console.log(`[EntityStore] 📋 Guideline markdown length: ${matchingGuideline.markdown.length} chars`)

      // Prepare content to assess; support stringified JSON with { content }
      let contentToAssess: unknown = section.entity!.content
      if (typeof contentToAssess === 'string') {
        try {
          const parsed = JSON.parse(contentToAssess)
          if (parsed && typeof parsed === 'object' && (parsed as Record<string, unknown>).content) {
            contentToAssess = (parsed as Record<string, unknown>).content
          }
        } catch {
          console.log(`[EntityStore] Content is already a string, using as-is`)
        }
      }


      const assessmentResult: GuidelineAssessmentResponse = await runGuidelineAssessment(
        contentToAssess as string,
        matchingGuideline.markdown,
        section.sectionName || section.sectionId,
        section.projectId,
        section.sectionId
      )

      if (!assessmentResult) {
        console.warn(`❌ [EntityStore] Guideline assessment FAILED for section: ${section.sectionId}`)
        console.warn(`[EntityStore] No assessment result returned from AI function`)
        return
      }

      // Defensive check: ensure qualityAssessment exists and is not empty
      if (!assessmentResult.qualityAssessment || assessmentResult.qualityAssessment.trim() === '') {
        console.warn(`⚠️ [EntityStore] No qualityAssessment in result or it's empty; nothing to update`)
        return
      }

      console.log(`🎉 [EntityStore] GUIDELINE ASSESSMENT COMPLETED SUCCESSFULLY!`)
      console.log(`[EntityStore] 📊 Assessment Results:`, {
        projectId: assessmentResult.projectId,
        sectionId: assessmentResult.sectionId,
        qualityAssessment: assessmentResult.qualityAssessment.substring(0, 100) + '...'
      })

      // ✅ Reuse the existing update method to write qualityAssessment only
      console.log(`[EntityStore] 🔄 Updating via updateSectionEntity('qualityAssessment')...`)
      const ok = await updateSectionEntity(
        section.projectId,
        section.sectionId,
        'qualityAssessment',
        assessmentResult.qualityAssessment
      )

      if (ok) {
        console.log(`✅ [EntityStore] Section entity updated successfully via updateSectionEntity`)

        // Also update qualityRating and percentComplete
        console.log(`[EntityStore] 🔄 Updating qualityRating and percentComplete...`)
        await updateSectionEntity(
          section.projectId,
          section.sectionId,
          'qualityRating',
          assessmentResult.qualityRating
        )
        await updateSectionEntity(
          section.projectId,
          section.sectionId,
          'percentComplete',
          assessmentResult.percentComplete
        )

        // Refresh the selected section data to ensure UI shows updated assessment
        console.log(`[EntityStore] 🔄 Refreshing selected section data...`)
        const refreshedSection = sections.value.find(s => s.projectId === section.projectId && s.sectionId === section.sectionId)
        if (refreshedSection) {
          console.log(`[EntityStore] 📊 Refreshed section data:`, {
            hasContent: !!refreshedSection.entity?.content,
            hasQualityAssessment: !!refreshedSection.entity?.qualityAssessment,
            qualityAssessmentLength: refreshedSection.entity?.qualityAssessment?.length || 0,
            qualityAssessmentPreview: refreshedSection.entity?.qualityAssessment?.substring(0, 100) + '...',
            qualityRating: refreshedSection.entity?.qualityRating,
            percentComplete: refreshedSection.entity?.percentComplete
          })

          // Update selectedSections with the refreshed data - force Vue reactivity
          selectedSections.value = []
          await nextTick()
          selectedSections.value = [refreshedSection]

          // Force another tick to ensure UI updates
          await nextTick()
          console.log(`[EntityStore] ✅ Selected sections updated with refreshed data`)

          // Trigger a manual reactivity update by temporarily modifying and restoring
          const temp = selectedSections.value
          selectedSections.value = []
          await nextTick()
          selectedSections.value = temp
          console.log(`[EntityStore] 🔄 Forced reactivity update`)
        } else {
          console.warn(`[EntityStore] ⚠️ Could not find refreshed section data`)
        }
      } else {
        console.warn(`⚠️ [EntityStore] Failed to update section entity via updateSectionEntity`)
      }

      // Loading state will be reset in finally block
      console.log(`[EntityStore] ✅ Assessment process completed successfully`)
    } catch {
      console.error(`💥 [EntityStore] ERROR during automatic guideline assessment`)
      console.error(`[EntityStore] Section: ${section.sectionId}`)

      // Loading state will be reset in finally block
      console.log(`[EntityStore] ❌ Assessment failed with error`)
    } finally {
      // Always reset loading state to avoid sticky spinners
      isAssessmentRunning.value = false
      console.log(`[EntityStore] 🔄 Loading state reset in finally block to: ${isAssessmentRunning.value}`)
    }
  }


  const setSelectedSections = async (selectedSectionsList: readonly ParsedFeasibilityStudySection[]): Promise<void> => {
    // Enforce single selection: keep only the first item if provided
    selectedSections.value = selectedSectionsList.length > 0 ? [selectedSectionsList[0]] : []

    if (selectedSectionsList.length === 0) {
      return
    }
  }

return {
// State
sections: sections,
isLoading: isLoading,
error: error,
selectedSections: selectedSections,
isAssessmentRunning: isAssessmentRunning,

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
