import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { rioTintoProjects } from '@/mockdata/mockData'

export interface Evaluation {
  commercial?: {
    contracts_structure: string
    key_issues: string
    status: string
    capital_cost_usd_billion: number | null
    npv_usd_billion: number | null
    irr_percent: string | null
    cost_risk_analysis: {
      contingency_percent: number
      escalation_allowance_percent: number
      confidence_class: string
    }
    contract_type: string
  }
  hse?: {
    eis_status: string
    rio_tinto_standards_aligned: boolean
    key_issues: string
    workforce_hse_statistics: {
      ltifr: number | null
      fatalities: number
    }
    ltif_trend_3yr: (number | null)[]
    fatality_prevention_controls: string
  }
  technical?: {
    compliance_study_definition_guidelines: string
    red_flags: Array<{
      category: string
      severity: string
      description: string
    }>
    sme: {
      electrical: string
      environmental: string
    }
    design_maturity_percent: number
    technology_readiness_level: number
  }
  asset_management?: {
    mine_life_years: number
    rehabilitation_provision_usd_billion: number
    sustaining_capex_usd_billion: number
    opex_usd_per_tonne: number
  }
  schedule?: {
    expected_first_production_year: number | null
    major_milestones: Array<{
      name: string
      date: string
    }>
    critical_path_issues: string
    schedule_risk_index: number
  }
}

export interface Project {
  id: string
  name: string
  country_region?: string
  key_minerals?: string[]
  capital_cost_usd_billion?: number | null
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
    status: string
  }>
  evaluation?: Evaluation
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
      ],
      evaluation: {
        commercial: {
          contracts_structure: "EPC contract with major contractors; long-term supply agreements in place",
          key_issues: "Supply chain optimization, cost control, market demand stability",
          status: "Operational with ongoing optimization",
          capital_cost_usd_billion: 1.9,
          npv_usd_billion: 2.1,
          irr_percent: "15-18",
          cost_risk_analysis: {
            contingency_percent: 8,
            escalation_allowance_percent: 3,
            confidence_class: "P90"
          },
          contract_type: "EPC + Operations & Maintenance"
        },
        hse: {
          eis_status: "Approved and operational; ongoing environmental monitoring",
          rio_tinto_standards_aligned: true,
          key_issues: "Dust management, biodiversity protection, community engagement",
          workforce_hse_statistics: {
            ltifr: 0.8,
            fatalities: 0
          },
          ltif_trend_3yr: [1.2, 1.0, 0.8],
          fatality_prevention_controls: "Comprehensive safety management system with regular audits"
        },
        technical: {
          compliance_study_definition_guidelines: "Fully compliant - operational excellence program in place",
          red_flags: [
            {
              category: "Equipment Reliability",
              severity: "Low",
              description: "Minor maintenance optimization opportunities"
            }
          ],
          sme: {
            electrical: "Power infrastructure stable and well-maintained",
            environmental: "Environmental controls meeting all regulatory requirements"
          },
          design_maturity_percent: 95,
          technology_readiness_level: 9
        },
        asset_management: {
          mine_life_years: 25,
          rehabilitation_provision_usd_billion: 0.3,
          sustaining_capex_usd_billion: 0.1,
          opex_usd_per_tonne: 12.5
        },
        schedule: {
          expected_first_production_year: 2019,
          major_milestones: [
            {
              name: "First Production",
              date: "2019-03"
            },
            {
              name: "Full Production",
              date: "2020-06"
            },
            {
              name: "Expansion Study",
              date: "2025-12"
            }
          ],
          critical_path_issues: "None - operational excellence focus",
          schedule_risk_index: 1
        }
      }
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
