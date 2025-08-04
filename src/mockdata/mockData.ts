// Mock data for HomeView dashboard
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/outline'

export const user = {
  name: 'Alex Johnson',
  avatar: '/assets/avatar.png',
  email: 'alex.johnson@example.com',
}

export const metricCards = [
  {
    id: 'activeProjects',
    title: 'Active Projects',
    value: 12,
    subtext: '+3 from last month',
    icon: ChartBarIcon,
  },
  {
    id: 'totalProjectValue',
    title: 'Total Project Value',
    value: '$8,200,000',
    subtext: 'Across all projects',
    icon: CurrencyDollarIcon,
  },
  {
    id: 'pendingReviews',
    title: 'Pending Reviews',
    value: 5,
    subtext: 'Requires attention',
    icon: ClockIcon,
  },
  {
    id: 'completionRate',
    title: 'Completion Rate',
    value: '87%',
    subtext: 'This quarter',
    icon: CheckCircleIcon,
  },
]

export const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'insights', label: 'All Insights' },
]

export const recentProjects = [
  {
    id: 'PROJ-2024-001',
    name: 'Hamersley Iron Expansion',
    proposers: 4,
    status: 'active'
  },
  {
    id: 'PROJ-2024-002',
    name: 'Brockman 4 Upgrade',
    proposers: 3,
    status: 'review'
  },
  {
    id: 'PROJ-2024-003',
    name: 'Yandicoogina Mine Study',
    proposers: 6,
    status: 'pending'
  },
]

// Rio Tinto Projects Data with Evaluation Details
export const rioTintoProjects = [
  {
    id: 'SIMANDOU-001',
    name: 'Simandou (Blocks 3&4)',
    country_region: 'Guinea',
    key_minerals: ['High‑grade iron ore'],
    capital_cost_usd_billion: 11.6,
    npv_usd_billion: null,
    post_tax_irr_percent: '11–13',
    workforce_construction_ops: null,
    current_status: 'Pre-sanction; early works under way, first ore targeted 2025',
    key_issues_risks: 'JV and Chinese / Guinean approvals still outstanding; 600 km rail and port mega‑scope',
    summary: 'The world\'s largest untapped high‑grade iron‑ore deposit now edging toward full sanction.',
    icon: GlobeAltIcon,
    status: 'pre-sanction',
    color: 'blue',
    milestones: [
      { date: '2024 Q4', title: 'JV Agreement Signed', description: 'Rio Tinto and Winning Consortium Simandou sign joint venture agreement', status: 'completed' },
      { date: '2025 Q1', title: 'Final Investment Decision', description: 'Board approval for full project sanction', status: 'pending' },
      { date: '2025 Q2', title: 'Construction Commencement', description: 'Start of major construction activities', status: 'pending' },
      { date: '2027 Q4', title: 'First Ore Production', description: 'Target for first iron ore production', status: 'pending' },
      { date: '2028 Q2', title: 'Full Production Ramp-up', description: 'Achieve full production capacity of 60 Mtpa', status: 'pending' }
    ],
    evaluation: {
      commercial: {
        contracts_structure: "JV Rio Tinto‑Simfer (Rio 45% WISE 35% Guinea 15% IFC 5%) plus WCS/Chinese partners; 50:50 rail & port capex split",
        key_issues: "Financing alignment, commodity price cycles, revenue sharing model",
        status: "Major investment agreements satisfied Jul 2024",
        capital_cost_usd_billion: 11.6,
        npv_usd_billion: null,
        irr_percent: "11–13",
        cost_risk_analysis: {
          contingency_percent: 12,
          escalation_allowance_percent: 5,
          confidence_class: "P50"
        },
        contract_type: "EPC (lumpsum) + Owner-managed packages"
      },
      hse: {
        eis_status: "Pre‑EIS baseline studies in progress; biodiversity offset plan for chimpanzee habitat under review",
        rio_tinto_standards_aligned: false,
        key_issues: "Biodiversity corridors, community resettlement, tropical disease risk",
        workforce_hse_statistics: {
          ltifr: null,
          fatalities: 0
        },
        ltif_trend_3yr: [null, null, null],
        fatality_prevention_controls: "Critical Risk Management (CRM) program in place"
      },
      technical: {
        compliance_study_definition_guidelines: "Partially compliant – PFS gap analysis complete, DFS in progress",
        red_flags: [
          {
            category: "Geotechnical",
            severity: "Medium",
            description: "Slope stability data gaps"
          },
          {
            category: "Port Logistics",
            severity: "High",
            description: "Design maturity <25 % vs SDG target 40 %"
          }
        ],
        sme: {
          electrical: "HV traction power demand for 600 km rail not yet locked into Guinea grid expansion plan",
          environmental: "Chimpanzee corridor mitigation plan not yet costed"
        },
        design_maturity_percent: 35,
        technology_readiness_level: 6
      },
      asset_management: {
        mine_life_years: 35,
        rehabilitation_provision_usd_billion: 1.2,
        sustaining_capex_usd_billion: 0.7,
        opex_usd_per_tonne: 19.5
      },
      schedule: {
        expected_first_production_year: 2025,
        major_milestones: [
          {
            name: "Rail construction mobilise",
            date: "2024‑11"
          },
          {
            name: "Start pit pre‑strip",
            date: "2025‑06"
          },
          {
            name: "First ore on ship",
            date: "2025‑12"
          }
        ],
        critical_path_issues: "Rail & port delivery sequence",
        schedule_risk_index: 1
      }
    }
  },
  {
    id: 'JADAR-001',
    name: 'Jadar Lithium–Borates',
    country_region: 'Serbia',
    key_minerals: ['Lithium carbonate', 'Boric acid'],
    capital_cost_usd_billion: 2.4,
    npv_usd_billion: null,
    post_tax_irr_percent: null,
    workforce_construction_ops: '2,100 / 1,000',
    current_status: 'Licences revoked 2022; re‑designated an EU "strategic project" 2025, still awaiting permits',
    key_issues_risks: 'Strong local opposition over water & land, pending parliamentary vote on lithium ban',
    summary: 'Europe\'s potential flagship lithium source but politically the company\'s most controversial green‑field project.',
    icon: ExclamationCircleIcon,
    status: 'licence-revoked',
    color: 'red',
    milestones: [
      { date: '2021 Q4', title: 'Feasibility Study Completed', description: 'Technical and economic feasibility study finalized', status: 'completed' },
      { date: '2022 Q1', title: 'Licence Revoked', description: 'Serbian government revokes mining licences', status: 'completed' },
      { date: '2025 Q1', title: 'EU Strategic Project Status', description: 'Project designated as EU strategic project', status: 'completed' },
      { date: '2025 Q4', title: 'Parliamentary Vote', description: 'Expected parliamentary vote on lithium mining ban', status: 'pending' },
      { date: '2026 Q2', title: 'Permit Reinstatement', description: 'Target for reinstatement of mining permits', status: 'pending' }
    ],
    evaluation: {
      commercial: {
        contracts_structure: "100 % Rio Tinto with potential EU‑backed financing",
        key_issues: "Capital carrying cost during project freeze; price volatility",
        status: "Permitting re‑initiated 2025",
        capital_cost_usd_billion: 2.4,
        npv_usd_billion: null,
        irr_percent: null,
        cost_risk_analysis: {
          contingency_percent: 12,
          escalation_allowance_percent: 5,
          confidence_class: "P50"
        },
        contract_type: "EPC (lumpsum) + Owner-managed packages"
      },
      hse: {
        eis_status: "EIS resubmission drafted; groundwater modelling contested by NGOs",
        rio_tinto_standards_aligned: false,
        key_issues: "Community opposition, water contamination fears, tailings stewardship",
        workforce_hse_statistics: {
          ltifr: null,
          fatalities: 0
        },
        ltif_trend_3yr: [null, null, null],
        fatality_prevention_controls: "Critical Risk Management (CRM) program in place"
      },
      technical: {
        compliance_study_definition_guidelines: "Non‑compliant – no approved FS, seismic baseline incomplete",
        red_flags: [
          {
            category: "Hydro‑geology",
            severity: "High",
            description: "Karst aquifer interaction unknown"
          },
          {
            category: "Tailings",
            severity: "High",
            description: "Preferred dry‑stack concept unconfirmed"
          }
        ],
        sme: {
          electrical: "Grid connection study complete, but EU supply‑chain funding uncertain",
          environmental: "Waste rock AMD potential under investigation"
        },
        design_maturity_percent: 35,
        technology_readiness_level: 6
      },
      asset_management: {
        mine_life_years: 26,
        rehabilitation_provision_usd_billion: 0.5,
        sustaining_capex_usd_billion: 0.52,
        opex_usd_per_tonne: 20.5
      },
      schedule: {
        expected_first_production_year: null,
        major_milestones: [
          {
            name: "Parliament vote on lithium ban",
            date: "2025‑10"
          },
          {
            name: "EIS public hearing",
            date: "2026‑02"
          }
        ],
        critical_path_issues: "Permitting vs construction mobilisation",
        schedule_risk_index: 1
      }
    }
  },
  {
    id: 'RINCON-001',
    name: 'Rincon Lithium Brine',
    country_region: 'Argentina (Salta)',
    key_minerals: ['Lithium carbonate'],
    capital_cost_usd_billion: 2.5,
    npv_usd_billion: null,
    post_tax_irr_percent: null,
    workforce_construction_ops: null,
    current_status: '3 kt starter plant produced first lithium Nov 2024; expansion earthworks start mid‑2025',
    key_issues_risks: 'Permitting, water use, ramp‑up execution in a high‑altitude salar',
    summary: 'Rio Tinto\'s first full‑scale lithium asset, using direct‑lithium‑extraction to halve water draw.',
    icon: CheckBadgeIcon,
    status: 'operational',
    color: 'green',
    milestones: [
      { date: '2023 Q2', title: 'Acquisition Completed', description: 'Rio Tinto acquires Rincon lithium project', status: 'completed' },
      { date: '2024 Q1', title: 'Starter Plant Construction', description: '3 kt starter plant construction begins', status: 'completed' },
      { date: '2024 Q4', title: 'First Lithium Production', description: 'First lithium carbonate produced from starter plant', status: 'completed' },
      { date: '2025 Q2', title: 'Expansion Earthworks', description: 'Start of expansion project earthworks', status: 'pending' },
      { date: '2026 Q4', title: 'Full Scale Production', description: 'Target for full scale production ramp-up', status: 'pending' }
    ],
    evaluation: {
      commercial: {
        contracts_structure: "100 % Rio Tinto; considering offtake pre‑payments",
        key_issues: "Inflationary pressure in Argentina; currency controls",
        status: "Expansion EPCM tender underway",
        capital_cost_usd_billion: 2.5,
        npv_usd_billion: null,
        irr_percent: null,
        cost_risk_analysis: {
          contingency_percent: 12,
          escalation_allowance_percent: 5,
          confidence_class: "P50"
        },
        contract_type: "EPC (lumpsum) + Owner-managed packages"
      },
      hse: {
        eis_status: "Provincial EIA approved 2023; DLE process reduces brine evaporation ponds by 60 %",
        rio_tinto_standards_aligned: true,
        key_issues: "Water balance in Salar, high‑altitude worker health",
        workforce_hse_statistics: {
          ltifr: 0.21,
          fatalities: 0
        },
        ltif_trend_3yr: [null, null, null],
        fatality_prevention_controls: "Critical Risk Management (CRM) program in place"
      },
      technical: {
        compliance_study_definition_guidelines: "Partially compliant – pilot plant data meets SDG for process, but wellfield model still P50 confidence",
        red_flags: [
          {
            category: "Wellfield",
            severity: "Medium",
            description: "Brine transmissivity variability"
          },
          {
            category: "Logistics",
            severity: "Low",
            description: "Salt‑flat haul‑road durability"
          }
        ],
        sme: {
          electrical: "25 MW hybrid solar‑diesel power solution selected",
          environmental: "Net‑positive water accounting framework in place"
        },
        design_maturity_percent: 35,
        technology_readiness_level: 6
      },
      asset_management: {
        mine_life_years: 40,
        rehabilitation_provision_usd_billion: 0.3,
        sustaining_capex_usd_billion: 0.8,
        opex_usd_per_tonne: 13.1
      },
      schedule: {
        expected_first_production_year: 2024,
        major_milestones: [
          {
            name: "Expansion earthworks",
            date: "2025‑07"
          },
          {
            name: "First 60 ktpa LC output",
            date: "2028‑03"
          }
        ],
        critical_path_issues: "Permitting vs construction mobilisation",
        schedule_risk_index: 3
      }
    }
  },
  {
    id: 'WINU-001',
    name: 'Winu Copper‑Gold',
    country_region: 'Western Australia (Great Sandy Desert)',
    key_minerals: ['Copper', 'Gold', 'Silver'],
    capital_cost_usd_billion: null,
    npv_usd_billion: null,
    post_tax_irr_percent: null,
    workforce_construction_ops: null,
    current_status: 'PFS in progress; Sumitomo JV signed 2024',
    key_issues_risks: 'Threatened‑species "night‑parrot" habitat triggered redesign; heritage approvals ongoing',
    summary: 'Early‑stage Pilbara copper hub aimed at ~25 yr life; now partnered with Sumitomo Metal Mining.',
    icon: MapPinIcon,
    status: 'pfs-progress',
    color: 'yellow',
    milestones: [
      { date: '2023 Q3', title: 'Discovery Confirmed', description: 'Initial discovery and resource estimation completed', status: 'completed' },
      { date: '2024 Q2', title: 'Sumitomo JV Signed', description: 'Joint venture agreement with Sumitomo Metal Mining', status: 'completed' },
      { date: '2025 Q1', title: 'PFS Completion', description: 'Pre-feasibility study completion', status: 'pending' },
      { date: '2026 Q2', title: 'Feasibility Study', description: 'Full feasibility study completion', status: 'pending' },
      { date: '2027 Q4', title: 'Final Investment Decision', description: 'Board approval for project development', status: 'pending' }
    ],
    evaluation: {
      commercial: {
        contracts_structure: "70 % Rio, 30 % Sumitomo Metal Mining; staged earn‑in with US$430 m payment",
        key_issues: "Funding of remote infrastructure; concentrate offtake terms",
        status: "JV finalised; PFS targeted Q4 2025",
        capital_cost_usd_billion: null,
        npv_usd_billion: null,
        irr_percent: null,
        cost_risk_analysis: {
          contingency_percent: 12,
          escalation_allowance_percent: 5,
          confidence_class: "P50"
        },
        contract_type: "EPC (lumpsum) + Owner-managed packages"
      },
      hse: {
        eis_status: "Referral lodged under WA Environmental Protection Act; night‑parrot habitat surveys pending",
        rio_tinto_standards_aligned: true,
        key_issues: "Species habitat impact, desert heat stress",
        workforce_hse_statistics: {
          ltifr: null,
          fatalities: 0
        },
        ltif_trend_3yr: [null, null, null],
        fatality_prevention_controls: "Critical Risk Management (CRM) program in place"
      },
      technical: {
        compliance_study_definition_guidelines: "Early study – PFS gate, compliance <50 %",
        red_flags: [
          {
            category: "Heritage",
            severity: "High",
            description: "Traditional Owner heritage clearance incomplete"
          },
          {
            category: "Resource Model",
            severity: "Medium",
            description: "Oxide transition zone metallurgical recovery"
          }
        ],
        sme: {
          electrical: "Off‑grid 80 MW hybrid solar‑diesel concept",
          environmental: "Desert dust emissions control plan draft"
        },
        design_maturity_percent: 35,
        technology_readiness_level: 6
      },
      asset_management: {
        mine_life_years: 25,
        rehabilitation_provision_usd_billion: 0.7,
        sustaining_capex_usd_billion: 0.5,
        opex_usd_per_tonne: 21.2
      },
      schedule: {
        expected_first_production_year: null,
        major_milestones: [
          {
            name: "PFS delivery",
            date: "2025‑11"
          },
          {
            name: "Heritage access agreement",
            date: "2026‑01"
          }
        ],
        critical_path_issues: "Permitting vs construction mobilisation",
        schedule_risk_index: 3
      }
    }
  },
  {
    id: 'GUDAI-DARRI-001',
    name: 'Gudai‑Darri Iron Ore',
    country_region: 'Pilbara, Australia',
    key_minerals: ['Iron ore'],
    capital_cost_usd_billion: 3.1,
    npv_usd_billion: null,
    post_tax_irr_percent: null,
    workforce_construction_ops: '3,000 / ~600',
    current_status: 'First ore Jun 2022, ramped to 43 Mtpa; de‑bottleneck to 50 Mtpa under study',
    key_issues_risks: 'Capital over‑runs (COVID labour & supply chain), incremental expansion capex, heritage management',
    summary: 'Rio\'s most automated iron‑ore mine—autonomous trucks, trains and 34 MW solar farm.',
    icon: BuildingOfficeIcon,
    status: 'operational',
    color: 'green',
    milestones: [
      { date: '2020 Q1', title: 'Construction Started', description: 'Major construction activities commence', status: 'completed' },
      { date: '2022 Q2', title: 'First Ore Production', description: 'First iron ore produced from Gudai-Darri', status: 'completed' },
      { date: '2023 Q4', title: 'Full Production Ramp-up', description: 'Achieved 43 Mtpa production capacity', status: 'completed' },
      { date: '2025 Q2', title: 'Debottlenecking Study', description: 'Study completion for 50 Mtpa expansion', status: 'pending' },
      { date: '2026 Q4', title: 'Expansion Implementation', description: 'Implementation of debottlenecking measures', status: 'pending' }
    ],
    evaluation: {
      commercial: {
        contracts_structure: "100 % Rio Tinto; long‑term supply agreements with Asian steel mills",
        key_issues: "A$500 m cost overrun, COVID labour shortages",
        status: "Operations optimisation phase",
        capital_cost_usd_billion: 3.1,
        npv_usd_billion: null,
        irr_percent: null,
        cost_risk_analysis: {
          contingency_percent: 12,
          escalation_allowance_percent: 5,
          confidence_class: "P50"
        },
        contract_type: "EPC (lumpsum) + Owner-managed packages"
      },
      hse: {
        eis_status: "Approved EIS with 324 conditions; 34 MW solar farm commissioned 2024",
        rio_tinto_standards_aligned: true,
        key_issues: "Heritage site protection, autonomous safety protocols",
        workforce_hse_statistics: {
          ltifr: 0.22,
          fatalities: 0
        },
        ltif_trend_3yr: [null, null, null],
        fatality_prevention_controls: "Critical Risk Management (CRM) program in place"
      },
      technical: {
        compliance_study_definition_guidelines: "Compliant – execution complete; post‑project review closed",
        red_flags: [
          {
            category: "Automation",
            severity: "Medium",
            description: "Autonomous truck software glitch incidents"
          },
          {
            category: "Processing",
            severity: "Low",
            description: "Screening bottlenecks pre‑de‑bottlenecking"
          }
        ],
        sme: {
          electrical: "Autonomous haul truck charging trials planned",
          environmental: "Renewable‑energy penetration target 30 %"
        },
        design_maturity_percent: 35,
        technology_readiness_level: 6
      },
      asset_management: {
        mine_life_years: 40,
        rehabilitation_provision_usd_billion: 0.9,
        sustaining_capex_usd_billion: 0.8,
        opex_usd_per_tonne: 19.1
      },
      schedule: {
        expected_first_production_year: 2022,
        major_milestones: [
          {
            name: "Autonomous truck fleet fully deployed",
            date: "2023‑08"
          },
          {
            name: "50 Mtpa debottleneck decision",
            date: "2025‑12"
          }
        ],
        critical_path_issues: "Permitting vs construction mobilisation",
        schedule_risk_index: 1
      }
    }
  },
  {
    id: 'OYU-TOLGOI-001',
    name: 'Oyu Tolgoi Underground',
    country_region: 'Mongolia (South Gobi)',
    key_minerals: ['Copper', 'Gold', 'Silver', 'Molybdenum'],
    capital_cost_usd_billion: 10.0,
    npv_usd_billion: null,
    post_tax_irr_percent: null,
    workforce_construction_ops: '>20,000 (97 % Mongolian)',
    current_status: 'Underground production began Mar 2023; ramp‑up to 500 kt Cu / y by 2028',
    key_issues_risks: 'Wage negotiations, pending Mongolian elections, potential resource‑nationalism',
    summary: 'World‑scale block‑cave set to be the 4th‑largest copper mine once fully ramped.',
    icon: UserGroupIcon,
    status: 'operational',
    color: 'green',
    milestones: [
      { date: '2022 Q4', title: 'Underground Development', description: 'Underground development activities commence', status: 'completed' },
      { date: '2023 Q1', title: 'First Underground Production', description: 'First copper production from underground mine', status: 'completed' },
      { date: '2025 Q2', title: 'Ramp-up Phase 1', description: 'Achieve 300 kt Cu/year production', status: 'pending' },
      { date: '2027 Q4', title: 'Ramp-up Phase 2', description: 'Achieve 400 kt Cu/year production', status: 'pending' },
      { date: '2028 Q4', title: 'Full Production', description: 'Achieve 500 kt Cu/year production capacity', status: 'pending' }
    ],
    evaluation: {
      commercial: {
        contracts_structure: "66 % Oyu Tolgoi LLC (OT) – Rio Tinto 50.8 % of Turquoise Hill; 34 % Mongolian gov.",
        key_issues: "US$1.4 bn cost overrun, tax dispute US$438 m",
        status: "Ramp‑up",
        capital_cost_usd_billion: 10.0,
        npv_usd_billion: 8.5,
        irr_percent: null,
        cost_risk_analysis: {
          contingency_percent: 12,
          escalation_allowance_percent: 5,
          confidence_class: "P50"
        },
        contract_type: "EPC (lumpsum) + Owner-managed packages"
      },
      hse: {
        eis_status: "EIS approved 2013, updated 2021; draft decarbonisation plan 2024",
        rio_tinto_standards_aligned: true,
        key_issues: "Underground heat stress, diesel particulate matter",
        workforce_hse_statistics: {
          ltifr: 0.27,
          fatalities: 1
        },
        ltif_trend_3yr: [null, null, null],
        fatality_prevention_controls: "Critical Risk Management (CRM) program in place"
      },
      technical: {
        compliance_study_definition_guidelines: "Compliant – FS update 2020 met SDG; panel‑cave geotechnical monitoring ongoing",
        red_flags: [
          {
            category: "Licence Transfer",
            severity: "High",
            description: "Panel‑1 licence transfer delay"
          },
          {
            category: "Cost",
            severity: "High",
            description: "Class‑action settlement on overruns"
          }
        ],
        sme: {
          electrical: "132 kV power link to national grid upgrade required",
          environmental: "Acid‑rock drainage management per OT ESIA"
        },
        design_maturity_percent: 35,
        technology_readiness_level: 6
      },
      asset_management: {
        mine_life_years: 95,
        rehabilitation_provision_usd_billion: 1.8,
        sustaining_capex_usd_billion: 1.9,
        opex_usd_per_tonne: 20.5
      },
      schedule: {
        expected_first_production_year: 2023,
        major_milestones: [
          {
            name: "Panel‑0 sustainable production",
            date: "2028‑01"
          },
          {
            name: "Full 95 ktpd throughput",
            date: "2030‑06"
          }
        ],
        critical_path_issues: "Permitting vs construction mobilisation",
        schedule_risk_index: 5
      }
    }
  }
]

export const aiSuggestions = [
  {
    id: 1,
    text: 'Review contract terms for Hamersley project.',
    projectRef: 'PROJ-2024-001',
    icon: ExclamationTriangleIcon
  },
  {
    id: 2,
    text: 'Update risk assessment for Brockman 4.',
    projectRef: 'PROJ-2024-002',
    icon: FlagIcon
  },
  {
    id: 3,
    text: 'Schedule technical review for Yandicoogina.',
    projectRef: 'PROJ-2024-003',
    icon: CalendarIcon
  },
]
