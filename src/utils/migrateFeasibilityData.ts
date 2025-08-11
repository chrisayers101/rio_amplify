import feasibilityData from '@/data/feasibility_scaffold_full.json'
import type { FeasibilityStudySection } from '@/types/feasibilityStudy'

/**
 * Utility to convert the existing feasibility data structure to the new DynamoDB schema
 * This can be used to seed your database or understand the data mapping
 */

export interface LegacySection {
  sectionId: string
  sectionName: string
  percentComplete: number
  statusOfCompleteness: string
  qualityRating: string
  issues: Array<{
    id: string
    description: string
    status: string
    source: string
  }>
  observations: Array<{
    id: string
    text: string
    source: string
    changeOccurred: boolean
  }>
  subSections: Array<{
    id: string
    name: string
    assessment: {
      quality: string
      consistency: string
      contradictions: string
      gaps: string
      guidelineReference: string
    }
    observations: Array<{
      note: string
      source: string
      changeDetected: boolean
    }>
    decisions: Array<{
      date: string
      original: string
      revised: string
      rationale: string
    }>
  }>
}

export function convertLegacySectionToNewSchema(
  legacySection: LegacySection,
  projectId: string = 'AMRUN'
): FeasibilityStudySection {
  // Map the old status to new enum values
  const mapStatus = (oldStatus: string): 'not_started' | 'in_progress' | 'complete' => {
    switch (oldStatus.toLowerCase()) {
      case 'complete':
        return 'complete'
      case 'mostly complete':
      case 'partially complete':
        return 'in_progress'
      case 'not started':
      case 'not complete':
      default:
        return 'not_started'
    }
  }

  // Convert percent complete to number
  const percentComplete = typeof legacySection.percentComplete === 'number'
    ? legacySection.percentComplete
    : 0

  // Create the entity object with all the nested data
  const entity = {
    sectionName: legacySection.sectionName,
    qualityRating: legacySection.qualityRating,
    content: {}, // Empty content object as required by interface
    issues: legacySection.issues,
    observations: legacySection.observations,
    subSections: legacySection.subSections.map(subSection => ({
      subSectionId: subSection.id,
      subSectionTitle: subSection.name,
      percentComplete: 0, // Default value since legacy doesn't have this
      content: {}, // Empty content object as required by interface
      assessment: subSection.assessment,
      observations: subSection.observations.map(obs => ({
        note: obs.note,
        source: obs.source,
        changeDetected: obs.changeDetected
      })),
      decisions: subSection.decisions.map(dec => ({
        date: dec.date,
        original: dec.original,
        revised: dec.revised,
        reason: dec.rationale || '', // Map rationale to reason
        source: '' // Legacy doesn't have source, use empty string
      }))
    }))
  }

  return {
    projectId,
    sectionId: legacySection.sectionId,
    percentComplete,
    status: mapStatus(legacySection.statusOfCompleteness),
    entity
  }
}

export function migrateAllSections(projectId: string = 'AMRUN'): FeasibilityStudySection[] {
  const legacySections = feasibilityData.feasibilityStudyView.sections as LegacySection[]

  return legacySections.map(section =>
    convertLegacySectionToNewSchema(section, projectId)
  )
}

// Example usage:
// const newSections = migrateAllSections('AMRUN')
// console.log('Migrated sections:', newSections)
