import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { rioTintoProjects } from '@/mockdata/mockData'

export interface Project {
  id: string
  name: string
  country_region?: string
  key_minerals?: string[]
  capital_cost_usd_billion?: number
  npv_usd_billion?: number | null
  post_tax_irr_percent?: string | null
  workforce_construction_ops?: string | null
  current_status?: string
  key_issues_risks?: string
  summary?: string
  icon?: any
  status?: string
  color?: string
  milestones?: Array<{
    date: string
    title: string
    description: string
    status: 'completed' | 'pending' | 'in-progress'
  }>
}

export const useProjectStore = defineStore('project', () => {
  // State
  const selectedProjectId = ref<string>('AMRUN-001') // Default to Amrun
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Add Amrun project to the projects list
  const allProjects: Project[] = [
    {
      id: 'AMRUN-001',
      name: 'Amrun',
      country_region: 'Queensland, Australia',
      key_minerals: ['Bauxite'],
      capital_cost_usd_billion: 1.9,
      npv_usd_billion: null,
      post_tax_irr_percent: '15-18',
      workforce_construction_ops: '1,200 / 400',
      current_status: 'Operational since 2019, producing 22.8 Mtpa bauxite',
      key_issues_risks: 'Environmental compliance, community relations, market demand fluctuations',
      summary: 'Rio Tinto\'s newest bauxite mine, supplying the global aluminum industry with high-quality ore.',
      status: 'operational',
      color: 'green',
      milestones: [
        { date: '2017 Q2', title: 'Project Approval', description: 'Board approval for Amrun bauxite project development', status: 'completed' },
        { date: '2018 Q1', title: 'Construction Started', description: 'Major construction activities commence', status: 'completed' },
        { date: '2019 Q1', title: 'First Production', description: 'First bauxite production from Amrun mine', status: 'completed' },
        { date: '2020 Q2', title: 'Full Production Ramp-up', description: 'Achieved full production capacity of 22.8 Mtpa', status: 'completed' },
        { date: '2025 Q4', title: 'Expansion Study', description: 'Study for potential production expansion', status: 'pending' }
      ]
    },
    ...rioTintoProjects
  ]

  // Computed
  const selectedProject = computed(() => {
    return allProjects.find(project => project.id === selectedProjectId.value)
  })

  const projects = computed(() => {
    return allProjects.map(project => ({
      id: project.id,
      name: project.name
    }))
  })

  const hasSelectedProject = computed(() => !!selectedProject.value)

  // Actions
  const setSelectedProject = (projectId: string): void => {
    const project = allProjects.find(p => p.id === projectId)
    if (project) {
      selectedProjectId.value = projectId
      error.value = null
    } else {
      error.value = 'Project not found'
    }
  }

  const getProjectById = (projectId: string): Project | undefined => {
    return allProjects.find(project => project.id === projectId)
  }

  const getAllProjects = (): Project[] => {
    return allProjects
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    // State
    selectedProjectId: readonly(selectedProjectId),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    selectedProject,
    projects,
    hasSelectedProject,

    // Actions
    setSelectedProject,
    getProjectById,
    getAllProjects,
    clearError
  }
})
