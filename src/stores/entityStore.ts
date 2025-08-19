import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth'
import type {
  FeasibilityStudySection,
  FeasibilityStudySectionStatus,
  ParsedFeasibilityStudySection,
  FeasibilityStudySectionEntity
} from '../../../shared/feasibilityStudy.types'
import type { GuidelineSection } from '../../../shared/guidelines.types'
import { useGuidelinesStore } from './guidelinesStore'
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

    // Helper function to find matching guideline for a section
  const findMatchingGuideline = (sectionId: string): GuidelineSection | null => {
    try {
      console.log(`[EntityStore] 🔍 Attempting to access guidelines store for section: ${sectionId}`)
      const guidelinesStore = useGuidelinesStore()
      console.log(`[EntityStore] 📚 Guidelines store accessed successfully:`, guidelinesStore)

      // Try to match by ID first (both are now strings)
      console.log(`[EntityStore] 🔢 Searching by ID: ${sectionId}`)
      const matchingGuideline = guidelinesStore.getSectionById(sectionId)
      console.log(`[EntityStore] 🎯 Guideline search by ID result:`, matchingGuideline)

      if (matchingGuideline) {
        return matchingGuideline
      }

      // Fallback: try to match by name
      console.log(`[EntityStore] 🔤 Fallback: searching by section name`)
      const matchingByName = guidelinesStore.getSectionByName(sectionId)
      console.log(`[EntityStore] 🎯 Guideline search by name result:`, matchingByName)

      return matchingByName || null
    } catch (error) {
      console.error(`[EntityStore] 💥 Error accessing guidelines store:`, error)
      console.error(`[EntityStore] Error details:`, error)
      return null
    }
  }

  // Helper function to run guideline assessment
  const runGuidelineAssessment = async (
    content: string,
    guideline: string,
    sectionName: string
  ): Promise<{
    qualityAssessment?: string
    percentComplete: number
    status: FeasibilityStudySectionStatus
  } | null> => {
    try {
      // Call the guideline assessment function via Amplify Data
      const { data: assessmentResult, errors } = await getClient().queries.guidelineAssessment({
        content,
        guideline,
        sectionName
      })

      if (errors) {
        console.error('Errors running guideline assessment:', errors)
        return null
      }

      return assessmentResult
    } catch (error) {
      console.error('Error running guideline assessment:', error)
      return null
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

    if (entityObject.hasOwnProperty('assessment')) {
      parsedEntity.assessment = entityObject.assessment as string
    }
    if (entityObject.hasOwnProperty('qualityAssessment')) {
      parsedEntity.qualityAssessment = entityObject.qualityAssessment as string
    }
    if (entityObject.hasOwnProperty('content')) {
      parsedEntity.content = entityObject.content as string
    }
    if (entityObject.hasOwnProperty('issues')) {
      parsedEntity.issues = entityObject.issues as string
    }
    if (entityObject.hasOwnProperty('observations')) {
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
      console.log(`[EntityStore] Full project sections data:`, JSON.stringify(parsedProjectSections, null, 2))
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
        } catch (error) {
          console.warn('Error logging selected entity:', error)
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
      console.log('[EntityStore] About to update database with entity:', entityJsonString)
      const result = await updateSection(projectId, sectionId, { entity: entityJsonString })
      console.log('[EntityStore] Database update result:', result ? 'success' : 'failed')

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

          // Log the full entity object that will be used by the handler
          console.log('[EntityStore] FULL ENTITY OBJECT FOR HANDLER:', JSON.stringify(selected.entity, null, 2))
        }
      } catch (error) {
        console.warn('Error logging selected entity:', error)
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

  const setSelectedSections = async (sections: readonly ParsedFeasibilityStudySection[]): Promise<void> => {
    console.log(`[EntityStore] 🔄 setSelectedSections called with ${sections.length} sections`)
    console.log(`[EntityStore] 📋 Sections:`, sections.map(s => ({ sectionId: s.sectionId, sectionName: s.sectionName })))

    // Enforce single selection: keep only the first item if provided
    selectedSections.value = sections.length > 0 ? [sections[0]] : []

    // If a section is selected, trigger automatic assessment
    if (sections.length > 0) {
      const section = sections[0]
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

      // Check if automatic guideline assessment should run
      if (section.entity?.content && !section.entity?.qualityAssessment) {
        console.log(`🚀 [EntityStore] AUTO-TRIGGERING GUIDELINE ASSESSMENT!`)
        console.log(`[EntityStore] 📝 Section has content (${section.entity.content.length} chars) but NO quality assessment`)
        console.log(`[EntityStore] 🔍 Starting assessment process for section: ${section.sectionId}`)

        try {
          // Find matching guideline
          console.log(`[EntityStore] 🔎 Searching for matching guideline...`)
          const matchingGuideline = findMatchingGuideline(section.sectionId)

          if (matchingGuideline) {
            console.log(`✅ [EntityStore] Found matching guideline: "${matchingGuideline.sectionName}" (ID: ${matchingGuideline.id})`)
            console.log(`[EntityStore] 📋 Guideline markdown length: ${matchingGuideline.markdown.length} chars`)

            // Run guideline assessment
            console.log(`🤖 [EntityStore] Calling AI guideline assessment function...`)
            const assessmentResult = await runGuidelineAssessment(
              section.entity.content,
              matchingGuideline.markdown,
              section.sectionName || section.sectionId
            )

            if (assessmentResult) {
              console.log(`🎉 [EntityStore] GUIDELINE ASSESSMENT COMPLETED SUCCESSFULLY!`)
              console.log(`[EntityStore] 📊 Assessment Results:`, {
                qualityAssessment: assessmentResult.qualityAssessment?.substring(0, 100) + '...',
                percentComplete: assessmentResult.percentComplete,
                status: assessmentResult.status
              })

              // Update the section with the assessment results
              console.log(`[EntityStore] 💾 Updating section in database...`)
              await updateSection(section.projectId, section.sectionId, {
                percentComplete: assessmentResult.percentComplete,
                status: assessmentResult.status,
                entity: JSON.stringify({
                  ...section.entity,
                  qualityAssessment: assessmentResult.qualityAssessment
                })
              })

              console.log(`✅ [EntityStore] Section successfully updated with assessment results!`)
              console.log(`[EntityStore] 🎯 New status: ${assessmentResult.status}, Completion: ${assessmentResult.percentComplete}%`)
            } else {
              console.warn(`❌ [EntityStore] Guideline assessment FAILED for section: ${section.sectionId}`)
              console.warn(`[EntityStore] No assessment result returned from AI function`)
            }
          } else {
            console.log(`⚠️ [EntityStore] No matching guideline found for section: ${section.sectionId}`)
            console.log(`[EntityStore] This section will not be automatically assessed`)
          }
        } catch (error) {
          console.error(`💥 [EntityStore] ERROR during automatic guideline assessment:`, error)
          console.error(`[EntityStore] Section: ${section.sectionId}, Error details:`, error)
        }
      } else {
        console.log(`⏭️ [EntityStore] Skipping guideline assessment`)
        console.log(`[EntityStore] Reason:`, {
          hasContent: !!section.entity?.content,
          hasQualityAssessment: !!section.entity?.qualityAssessment,
          contentLength: section.entity?.content?.length || 0,
          qualityAssessmentLength: section.entity?.qualityAssessment?.length || 0
        })

        if (!section.entity?.content) {
          console.log(`[EntityStore] ℹ️ No content to assess`)
        } else if (section.entity?.qualityAssessment) {
          console.log(`[EntityStore] ℹ️ Quality assessment already exists`)
        }
      }

      console.log(`[EntityStore] 🏁 Section selection and assessment process completed for: ${section.sectionId}`)
    } else {
      console.log(`[EntityStore] ℹ️ No sections provided, clearing selection`)
    }
  }

  const clearSelectedSections = (): void => {
    selectedSections.value = []
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
    removeSelectedSection,

    // Utility functions
    getSectionDisplayName,
    formatStatus,
    getStatusClass,
    formatTabName,
    formatPropertyName,
    getCompletionStatus,

    // Helper functions
    findMatchingGuideline,
    runGuidelineAssessment
  }
})
