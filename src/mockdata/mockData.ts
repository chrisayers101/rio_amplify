// Mock data for HomeView dashboard
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  CalendarIcon
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
