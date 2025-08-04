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

// Rio Tinto Projects Data
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
