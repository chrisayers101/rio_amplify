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
    color: 'blue'
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
    color: 'red'
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
    color: 'green'
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
    color: 'yellow'
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
    color: 'green'
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
    color: 'green'
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
