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





  // Helper function to check if qualityAssessment is completed (not "no data available")
  const isQualityAssessmentCompleted = (entity: any): boolean => {
    return entity?.qualityAssessment !== "no data available"
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

      const guidelinesStore = useGuidelinesStore()




      const matchingGuideline = guidelinesStore.getSectionById(sectionId)


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
      return null
    }
  }

  // Helper function to run guideline assessment
  const runGuidelineAssessment = async (
    content: string,
    guideline: string,
    sectionName: string,
    projectId: string,
    sectionId: string
  ): Promise<{
    projectId: string
    sectionId: string
    qualityAssessment?: string
  } | null> => {
    try {


      // Call the guideline assessment function via Amplify Data
      const { data: assessmentResult, errors } = await getClient().queries.guidelineAssessment({
        content,
        guideline,
        sectionName,
        projectId,
        sectionId
      })



      if (errors) {
        console.error('❌ Errors running guideline assessment:', errors)
        return null
      }

      console.log(`[EntityStore] 📥 Raw assessment result:`, assessmentResult)


      // Handle the response - it might already be parsed by Amplify Data
      let parsedResult = assessmentResult

      // If it's a string, try to parse it
      if (typeof assessmentResult === 'string') {
        try {
          parsedResult = JSON.parse(assessmentResult)
          console.log(`[EntityStore] ✅ Parsed JSON string result:`, parsedResult)
        } catch (parseError) {
          console.error(`❌ Failed to parse assessment result:`, parseError)
          console.error(`📄 Raw result:`, assessmentResult)
          return null
        }
      } else {
        console.log(`[EntityStore] ✅ Assessment result already parsed:`, parsedResult)
      }

      // Validate the parsed result
      if (!parsedResult || typeof parsedResult !== 'object') {
        console.error(`❌ Invalid assessment result structure:`, parsedResult)
        return null
      }

      // Ensure required fields are present
      const result = {
        projectId: parsedResult.projectId || '',
        sectionId: parsedResult.sectionId || '',
        qualityAssessment: parsedResult.qualityAssessment || ''
      }

      console.log(`[EntityStore] 🎯 Final assessment result:`, result)
      return result
    } catch (error) {
      console.error('💥 Error running guideline assessment:', error)
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
      sections.value = sectionsList.map((section: FeasibilityStudySection) => ({
        ...section,
        entity: parseEntityData(section.entity)
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
        entity: parseEntityData(section.entity)
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
      const parsedSection: ParsedFeasibilityStudySection = {
        ...newSection,
        entity: parseEntityData(newSection.entity)
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



      // Update in local state
      const updatedSectionData: ParsedFeasibilityStudySection = {
        ...updatedSection,
        entity: parseEntityData(updatedSection.entity)
      }

      const index = sections.value.findIndex(s => s.projectId === projectId && s.sectionId === sectionId)
      if (index !== -1) {
        sections.value[index] = updatedSectionData
      }

      // Keep selectedSections in sync to avoid stale object references
      const isSelected = selectedSections.value.some(s => s.projectId === projectId && s.sectionId === sectionId)
      if (isSelected) {
        selectedSections.value = [updatedSectionData]
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

      return updatedSectionData
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

      // Get the current entity data
      const currentEntity = currentSection.entity || {}

      console.log(`[EntityStore] 🔍 Current entity before update:`, {
        type: typeof currentEntity,
        keys: Object.keys(currentEntity || {}),
        hasContent: !!currentEntity?.content,
        hasQualityAssessment: isQualityAssessmentCompleted(currentEntity)
      })

      // Create updated entity with the new field value
      const updatedEntity = {
        ...currentEntity,
        [fieldName]: newValue
      }

      console.log(`[EntityStore] 🔍 Updated entity after merge:`, {
        keys: Object.keys(updatedEntity),
        hasContent: !!updatedEntity.content,
        hasQualityAssessment: isQualityAssessmentCompleted(updatedEntity),
        contentLength: updatedEntity.content?.length || 0,
        qualityAssessmentLength: updatedEntity.qualityAssessment?.length || 0
      })

      // Store the entity object directly - DynamoDB will handle the structure
      console.log('[EntityStore] About to update database with entity:', updatedEntity)
      const result = await updateSection(projectId, sectionId, { entity: updatedEntity })
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
        hasQualityAssessment: isQualityAssessmentCompleted(section.entity),
        contentLength: section.entity?.content?.length || 0
      })

    //   // Check if automatic guideline assessment should run
    //   if (section.entity?.content && !isQualityAssessmentCompleted(section.entity)) {
    //     console.log(`🚀 [EntityStore] AUTO-TRIGGERING GUIDELINE ASSESSMENT!`)
    //     console.log(`[EntityStore] 📝 Section has content (${section.entity.content.length} chars) but NO quality assessment`)
    //     console.log(`[EntityStore] 🔍 Starting assessment process for section: ${section.sectionId}`)

    //     try {
    //       // Find matching guideline
    //       console.log(`[EntityStore] 🔎 Searching for matching guideline...`)
    //       const matchingGuideline = findMatchingGuideline(section.sectionId)

    //       if (matchingGuideline) {
    //         console.log(`✅ [EntityStore] Found matching guideline: "${matchingGuideline.sectionName}" (ID: ${matchingGuideline.id})`)
    //         console.log(`[EntityStore] 📋 Guideline markdown length: ${matchingGuideline.markdown.length} chars`)

    //         // Ensure we have the content properly extracted
    //         let contentToAssess = section.entity.content
    //         if (typeof contentToAssess === 'string') {
    //           // If content is a string, it might be JSON-encoded, try to parse it
    //           try {
    //             const parsedContent = JSON.parse(contentToAssess)
    //             if (parsedContent && typeof parsedContent === 'object' && parsedContent.content) {
    //               contentToAssess = parsedContent.content
    //             }
    //           } catch (parseError) {
    //             // If parsing fails, use the string as-is
    //             console.log(`[EntityStore] Content is already a string, using as-is`)
    //           }
    //         }

    //         // Run guideline assessment
    //         console.log(`🤖 [EntityStore] Calling AI guideline assessment function...`)
    //         const assessmentResult = await runGuidelineAssessment(
    //           contentToAssess,
    //           matchingGuideline.markdown,
    //           section.sectionName || section.sectionId,
    //           section.projectId,
    //           section.sectionId
    //         )

    //                     if (assessmentResult) {
    //                       console.log(`🎉 [EntityStore] GUIDELINE ASSESSMENT COMPLETED SUCCESSFULLY!`)
    //                       console.log(`[EntityStore] 📊 Assessment Results:`, {
    //                         projectId: assessmentResult.projectId,
    //                         sectionId: assessmentResult.sectionId,
    //                         qualityAssessment: assessmentResult.qualityAssessment?.substring(0, 100) + '...'
    //                       })

    //                       // Update the section with the assessment results
    //                       console.log(`[EntityStore] 💾 Updating section in database...`)

    //                       // Get the current entity data, handling both string and object formats
    //                       let currentEntity = section.entity
    //                       if (typeof currentEntity === 'string') {
    //                         try {
    //                           currentEntity = JSON.parse(currentEntity)
    //                         } catch (parseError) {
    //                           console.warn(`[EntityStore] Could not parse existing entity, creating new one:`, parseError)
    //                           currentEntity = {}
    //                         }
    //                       }

    //                       // Create updated entity with ONLY the fields that belong in the entity
    //                       // Filter out percentComplete and status - these don't belong in the entity
    //                       const updatedEntity: FeasibilityStudySectionEntity = {
    //                         content: currentEntity.content || '',
    //                         qualityAssessment: assessmentResult.qualityAssessment || ''
    //                       }

    //                       // Double-check: ensure ONLY allowed fields exist
    //                       const allowedFields = ['content', 'qualityAssessment']
    //                       const filteredEntity: FeasibilityStudySectionEntity = {}

    //                       allowedFields.forEach(field => {
    //                         if (updatedEntity[field as keyof FeasibilityStudySectionEntity]) {
    //                           filteredEntity[field as keyof FeasibilityStudySectionEntity] = updatedEntity[field as keyof FeasibilityStudySectionEntity]
    //                         }
    //                       })

    //                       console.log(`[EntityStore] 🔍 Filtered entity keys:`, Object.keys(filteredEntity))
    //                       console.log(`[EntityStore] 🔍 Filtered entity has content:`, !!filteredEntity.content)
    //                       console.log(`[EntityStore] 🔍 Filtered entity has qualityAssessment:`, isQualityAssessmentCompleted(filteredEntity))

    //                       console.log(`[EntityStore] 📝 Updated entity structure:`, {
    //                         hasContent: !!filteredEntity.content,
    //                         hasQualityAssessment: isQualityAssessmentCompleted(filteredEntity),
    //                         contentLength: filteredEntity.content?.length || 0,
    //                         qualityAssessmentLength: filteredEntity.qualityAssessment?.length || 0
    //                       })

    //                       // Debug: Check the entity structure before sending to database
    //                       console.log(`[EntityStore] 🔍 Entity keys:`, Object.keys(filteredEntity))
    //                       console.log(`[EntityStore] 🔍 Quality assessment preview:`, filteredEntity.qualityAssessment?.substring(0, 100))

    //                       // Update the section using the same function that handles user edits
    //                       console.log(`[EntityStore] 🔄 Using updateSection to update entity directly...`)

    //                       if (assessmentResult.qualityAssessment) {
    //                         // Send entity as object directly (Amplify expects a.json())
    //                         console.log(`[EntityStore] 🔍 Sending entity object to Amplify:`, {
    //                           keys: Object.keys(filteredEntity),
    //                           contentLength: filteredEntity.content?.length || 0,
    //                           qualityAssessmentLength: filteredEntity.qualityAssessment?.length || 0
    //                         })

    //                         // Debug: Log the exact entity being sent
    //                         console.log(`[EntityStore] 🔍 FULL ENTITY OBJECT BEING SENT:`, JSON.stringify(filteredEntity, null, 2))
    //                         console.log(`[EntityStore] 🔍 ENTITY TYPE:`, typeof filteredEntity)
    //                         console.log(`[EntityStore] 🔍 ENTITY KEYS:`, Object.keys(filteredEntity))

    //                         // Update the section with the filtered entity object
    //                         const result = await updateSection(section.projectId, section.sectionId, {
    //                           entity: filteredEntity
    //                         })

    //                         if (result) {
    //                           console.log(`✅ [EntityStore] Section entity updated successfully via updateSection`)

    //                           // Log the store state after the update - COMPREHENSIVE
    //                           console.log(`[EntityStore] 🔍 STORE STATE AFTER QUALITY ASSESSMENT UPDATE:`)
    //                           if (selectedSections.value && selectedSections.value.length > 0) {
    //                             const selectedSection = selectedSections.value[0]
    //                             console.log(`[EntityStore] 📊 SELECTED SECTION STORE OBJECT (FULL):`, selectedSection)
    //                             console.log(`[EntityStore] 📊 Selected section details:`, {
    //                               projectId: selectedSection.projectId,
    //                               sectionId: selectedSection.sectionId,
    //                               hasEntity: !!selectedSection.entity,
    //                               entityType: typeof selectedSection.entity,
    //                               entityKeys: selectedSection.entity && typeof selectedSection.entity === 'string' ?
    //                                 'STRING_NEEDS_PARSING' :
    //                                 Object.keys(selectedSection.entity || {}),
    //                               hasQualityAssessment: selectedSection.entity && typeof selectedSection.entity === 'string' ?
    //                                 selectedSection.entity.includes('qualityAssessment') :
    //                                 isQualityAssessmentCompleted(selectedSection.entity),
    //                               entityPreview: selectedSection.entity && typeof selectedSection.entity === 'string' ?
    //                                 selectedSection.entity.substring(0, 200) + '...' :
    //                                 JSON.stringify(selectedSection.entity).substring(0, 200) + '...'
    //                             })
    //                           } else {
    //                             console.log(`[EntityStore] 📊 No selected sections`)
    //                           }

    //                           // Log the specific updated section
    //                           const updatedSection = getSection(section.projectId, section.sectionId)
    //                           if (updatedSection) {
    //                             // Safely handle entity data that might be a string or object
    //                             let entityKeys = []
    //                             let hasQualityAssessment = false
    //                             let qualityAssessmentPreview = 'N/A'

    //                             if (updatedSection.entity) {
    //                               if (typeof updatedSection.entity === 'string') {
    //                                 try {
    //                                   const parsedEntity = JSON.parse(updatedSection.entity)
    //                                   entityKeys = Object.keys(parsedEntity)
    //                                   hasQualityAssessment = !!parsedEntity.qualityAssessment
    //                                   qualityAssessmentPreview = parsedEntity.qualityAssessment ?
    //                                     parsedEntity.qualityAssessment.substring(0, 100) + '...' : 'N/A'
    //                                 } catch (parseError) {
    //                                   console.warn(`[EntityStore] Could not parse updated section entity:`, parseError)
    //                                   entityKeys = ['<parse_error>']
    //                                   hasQualityAssessment = false
    //                                   qualityAssessmentPreview = 'N/A'
    //                                 }
    //                               } else if (typeof updatedSection.entity === 'object') {
    //                                 entityKeys = Object.keys(updatedSection.entity)
    //                                 hasQualityAssessment = isQualityAssessmentCompleted(updatedSection.entity)
    //                                 qualityAssessmentPreview = updatedSection.entity.qualityAssessment ?
    //                                   updatedSection.entity.qualityAssessment.substring(0, 100) + '...' : 'N/A'
    //                               }
    //                             }

    //                             console.log(`[EntityStore] 📝 UPDATED SECTION DETAILS:`, {
    //                               projectId: updatedSection.projectId,
    //                               sectionId: updatedSection.sectionId,
    //                               hasEntity: !!updatedSection.entity,
    //                               entityType: typeof updatedSection.entity,
    //                               entityKeys: entityKeys,
    //                               hasQualityAssessment: hasQualityAssessment,
    //                               qualityAssessmentPreview: qualityAssessmentPreview
    //                             })
    //                           }

    //                           // Log all sections to see the full store state - SIMPLIFIED
    //                           if (sections.value && Array.isArray(sections.value)) {
    //                             console.log(`[EntityStore] 📚 ALL SECTIONS IN STORE:`, sections.value.length, 'sections')
    //                             sections.value.forEach((s: ParsedFeasibilityStudySection) => {
    //                               console.log(`[EntityStore] 📋 Section ${s.sectionId}:`, {
    //                                 hasEntity: !!s.entity,
    //                                 entityType: typeof s.entity,
    //                                 hasQualityAssessment: s.entity && typeof s.entity === 'string' ?
    //                                   s.entity.includes('qualityAssessment') :
    //                                   isQualityAssessmentCompleted(s.entity)
    //                               })
    //                             })
    //                           } else {
    //                             console.log(`[EntityStore] 📚 ALL SECTIONS IN STORE: sections.value is`, typeof sections.value)
    //                           }

    //                         } else {
    //                           console.warn(`⚠️ [EntityStore] Failed to update section entity via updateSectionEntity`)
    //                         }
    //                       } else {
    //                         console.warn(`⚠️ [EntityStore] No quality assessment to update`)
    //                       }

    //                       console.log(`✅ [EntityStore] Section successfully updated with assessment results!`)
    //                       console.log(`[EntityStore] 🎯 Quality assessment added for section: ${assessmentResult.sectionId}`)
    //                     } else {
    //                       console.warn(`❌ [EntityStore] Guideline assessment FAILED for section: ${section.sectionId}`)
    //                       console.warn(`[EntityStore] No assessment result returned from AI function`)
    //                     }
    //                   } else {
    //                     console.log(`⚠️ [EntityStore] No matching guideline found for section: ${section.sectionId}`)
    //                     console.log(`[EntityStore] This section will not be automatically assessed`)
    //                   }
    //                 } catch (error) {
    //                   console.error(`💥 [EntityStore] ERROR during automatic guideline assessment:`, error)
    //                   console.error(`[EntityStore] Section: ${section.sectionId}, Error details:`, error)
    //                 }
    //               } else {
    //                 console.log(`⏭️ [EntityStore] Skipping guideline assessment`)
    //                 console.log(`[EntityStore] Reason:`, {
    //                   hasContent: !!section.entity?.content,
    //                   hasQualityAssessment: isQualityAssessmentCompleted(section.entity),
    //                   contentLength: section.entity?.content?.length || 0,
    //                   qualityAssessmentLength: section.entity?.qualityAssessment?.length || 0
    //                 })

    //                 if (!section.entity?.content) {
    //                   console.log(`[EntityStore] ℹ️ No content to assess`)
    //                 } else if (isQualityAssessmentCompleted(section.entity)) {
    //                   console.log(`[EntityStore] ℹ️ Quality assessment already exists`)
    //                 }
    //               }

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
