<template>
  <div class="project-issues">
    <div class="issues-header">
      <h2>Project Issues</h2>
      <p>Track and manage project issues, blockers, and action items</p>
    </div>

    <!-- Issues Summary Cards -->
    <div class="issues-summary-grid">
      <div class="issues-summary-card open">
        <div class="card-icon">
          <ExclamationCircleIcon />
        </div>
        <div class="card-content">
          <h3>Open Issues</h3>
          <div class="issues-count">{{ openIssuesCount }}</div>
          <div class="issues-label">require attention</div>
        </div>
      </div>

      <div class="issues-summary-card in-progress">
        <div class="card-icon">
          <ClockIcon />
        </div>
        <div class="card-content">
          <h3>In Progress</h3>
          <div class="issues-count">{{ inProgressIssuesCount }}</div>
          <div class="issues-label">being addressed</div>
        </div>
      </div>

      <div class="issues-summary-card resolved">
        <div class="card-icon">
          <CheckCircleIcon />
        </div>
        <div class="card-content">
          <h3>Resolved</h3>
          <div class="issues-count">{{ resolvedIssuesCount }}</div>
          <div class="issues-label">completed this month</div>
        </div>
      </div>

      <div class="issues-summary-card overdue">
        <div class="card-icon">
          <ExclamationTriangleIcon />
        </div>
        <div class="card-content">
          <h3>Overdue</h3>
          <div class="issues-count">{{ overdueIssuesCount }}</div>
          <div class="issues-label">past due date</div>
        </div>
      </div>
    </div>

    <!-- Issues Management -->
    <div class="issues-management-section">
      <div class="section-header">
        <h3>Issues Management</h3>
        <button class="add-issue-btn" @click="showAddIssueForm = true">
          <PlusIcon class="btn-icon" />
          Add Issue
        </button>
      </div>

      <!-- Filters and Search -->
      <div class="filters-container">
        <div class="search-box">
          <MagnifyingGlassIcon class="search-icon" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search issues..."
            class="search-input"
          />
        </div>
        <div class="filter-buttons">
          <button
            v-for="filter in issueFilters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            :class="['filter-btn', { active: activeFilter === filter.value }]"
          >
            {{ filter.label }}
          </button>
        </div>
        <div class="sort-controls">
          <select v-model="sortBy" class="sort-select">
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="createdDate">Sort by Created Date</option>
            <option value="assignee">Sort by Assignee</option>
          </select>
        </div>
      </div>

      <!-- Issues List -->
      <div class="issues-list">
        <div
          v-for="issue in filteredAndSortedIssues"
          :key="issue.id"
          class="issue-item"
          :class="getIssueClass(issue.priority)"
        >
          <div class="issue-header">
            <div class="issue-priority" :class="getIssueClass(issue.priority)">
              {{ issue.priority }}
            </div>
            <div class="issue-title">{{ issue.title }}</div>
            <div class="issue-status" :class="getStatusClass(issue.status)">
              {{ issue.status }}
            </div>
          </div>

          <div class="issue-description">{{ issue.description }}</div>

          <div class="issue-meta">
            <div class="meta-item">
              <span class="meta-label">Category:</span>
              <span class="meta-value">{{ issue.category }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Assignee:</span>
              <span class="meta-value">{{ issue.assignee }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Due Date:</span>
              <span class="meta-value" :class="{ 'overdue': isOverdue(issue.dueDate) }">
                {{ formatDate(issue.dueDate) }}
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Created:</span>
              <span class="meta-value">{{ formatDate(issue.createdDate) }}</span>
            </div>
          </div>

          <div class="issue-actions">
            <div class="action-buttons">
              <button class="action-btn edit" @click="editIssue(issue)">
                <PencilIcon class="action-icon" />
                Edit
              </button>
              <button class="action-btn resolve" @click="resolveIssue(issue.id)">
                <CheckIcon class="action-icon" />
                Resolve
              </button>
              <button class="action-btn delete" @click="deleteIssue(issue.id)">
                <TrashIcon class="action-icon" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredAndSortedIssues.length === 0" class="empty-state">
        <div class="empty-icon">
          <DocumentTextIcon />
        </div>
        <h4>No Issues Found</h4>
        <p>{{ searchTerm ? 'No issues match your search criteria.' : 'No issues have been created yet.' }}</p>
        <button class="add-issue-btn" @click="showAddIssueForm = true">
          <PlusIcon class="btn-icon" />
          Add Your First Issue
        </button>
      </div>
    </div>

    <!-- Add Issue Modal (Placeholder) -->
    <div v-if="showAddIssueForm" class="modal-overlay" @click="showAddIssueForm = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Add New Issue</h3>
          <button class="close-btn" @click="showAddIssueForm = false">×</button>
        </div>
        <div class="modal-body">
          <p>Issue creation form would go here. This is a placeholder for the modal functionality.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ExclamationCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  CheckIcon,
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

// Mock data - in a real app, this would come from props or store
const issues = ref([
  {
    id: 1,
    title: 'Environmental Impact Assessment Delayed',
    description: 'The EIA report is behind schedule due to additional stakeholder consultation requirements.',
    priority: 'High',
    status: 'Open',
    category: 'Environmental',
    assignee: 'Environmental Team',
    dueDate: '2024-02-15',
    createdDate: '2024-01-10'
  },
  {
    id: 2,
    title: 'Technical Design Review Pending',
    description: 'Critical technical design documents require peer review before proceeding to construction.',
    priority: 'Medium',
    status: 'In Progress',
    category: 'Technical',
    assignee: 'Technical Lead',
    dueDate: '2024-02-28',
    createdDate: '2024-01-15'
  },
  {
    id: 3,
    title: 'Budget Approval Delayed',
    description: 'Additional funding approval is pending from corporate finance committee.',
    priority: 'High',
    status: 'Open',
    category: 'Financial',
    assignee: 'Project Manager',
    dueDate: '2024-01-31',
    createdDate: '2024-01-05'
  },
  {
    id: 4,
    title: 'Community Consultation Meeting',
    description: 'Schedule community consultation meeting to address local concerns about the project.',
    priority: 'Medium',
    status: 'Planned',
    category: 'Stakeholder',
    assignee: 'Community Relations',
    dueDate: '2024-03-15',
    createdDate: '2024-01-20'
  },
  {
    id: 5,
    title: 'Equipment Procurement',
    description: 'Specialized mining equipment needs to be ordered with long lead times.',
    priority: 'Low',
    status: 'In Progress',
    category: 'Procurement',
    assignee: 'Procurement Team',
    dueDate: '2024-04-30',
    createdDate: '2024-01-12'
  }
])

const searchTerm = ref('')
const activeFilter = ref('all')
const sortBy = ref('priority')
const showAddIssueForm = ref(false)

const issueFilters = [
  { label: 'All Issues', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Overdue', value: 'overdue' }
]

// Computed properties
const openIssuesCount = computed(() => issues.value.filter(i => i.status === 'Open').length)
const inProgressIssuesCount = computed(() => issues.value.filter(i => i.status === 'In Progress').length)
const resolvedIssuesCount = computed(() => issues.value.filter(i => i.status === 'Resolved').length)
const overdueIssuesCount = computed(() => issues.value.filter(i => isOverdue(i.dueDate)).length)

const filteredAndSortedIssues = computed(() => {
  let filtered = issues.value

  // Apply status filter
  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'overdue') {
      filtered = filtered.filter(issue => isOverdue(issue.dueDate))
    } else {
      filtered = filtered.filter(issue =>
        issue.status.toLowerCase().replace(' ', '-') === activeFilter.value
      )
    }
  }

  // Apply search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(issue =>
      issue.title.toLowerCase().includes(search) ||
      issue.description.toLowerCase().includes(search) ||
      issue.assignee.toLowerCase().includes(search) ||
      issue.category.toLowerCase().includes(search)
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'priority':
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case 'createdDate':
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      case 'assignee':
        return a.assignee.localeCompare(b.assignee)
      default:
        return 0
    }
  })

  return filtered
})

// Helper functions
const getIssueClass = (priority: string) => {
  return priority.toLowerCase().replace(' ', '-')
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'status-open'
    case 'in progress':
      return 'status-in-progress'
    case 'resolved':
      return 'status-resolved'
    case 'planned':
      return 'status-planned'
    default:
      return 'status-unknown'
  }
}

const getPriorityWeight = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return 3
    case 'medium': return 2
    case 'low': return 1
    default: return 0
  }
}

const isOverdue = (dueDate: string) => {
  return new Date(dueDate) < new Date()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const editIssue = (issue: any) => {
  console.log('Edit issue:', issue)
  // In a real app, this would open an edit form
}

const resolveIssue = (issueId: number) => {
  const issue = issues.value.find(i => i.id === issueId)
  if (issue) {
    issue.status = 'Resolved'
  }
}

const deleteIssue = (issueId: number) => {
  const index = issues.value.findIndex(i => i.id === issueId)
  if (index > -1) {
    issues.value.splice(index, 1)
  }
}
</script>

<style scoped>
.project-issues {
  padding: 24px;
  background: #f8fafc;
  height: 100%;
  overflow-y: auto;
}

.issues-header {
  margin-bottom: 32px;
  text-align: center;
}

.issues-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.issues-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.issues-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.issues-summary-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.issues-summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.issues-summary-card.open {
  border-left: 4px solid #ef4444;
}

.issues-summary-card.in-progress {
  border-left: 4px solid #f59e0b;
}

.issues-summary-card.resolved {
  border-left: 4px solid #10b981;
}

.issues-summary-card.overdue {
  border-left: 4px solid #dc2626;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.issues-summary-card.open .card-icon {
  background: #fee2e2;
  color: #dc2626;
}

.issues-summary-card.in-progress .card-icon {
  background: #fef3c7;
  color: #d97706;
}

.issues-summary-card.resolved .card-icon {
  background: #dcfce7;
  color: #059669;
}

.issues-summary-card.overdue .card-icon {
  background: #fef2f2;
  color: #dc2626;
}

.card-icon svg {
  width: 20px;
  height: 20px;
}

.card-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.issues-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.issues-label {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.issues-management-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.add-issue-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #008C8E;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-issue-btn:hover {
  background: #007a7c;
  transform: translateY(-1px);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.filters-container {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #008C8E;
  box-shadow: 0 0 0 3px rgba(0, 140, 142, 0.1);
}

.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.filter-btn.active {
  background: #008C8E;
  border-color: #008C8E;
  color: white;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  outline: none;
}

.sort-select:focus {
  border-color: #008C8E;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.issue-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: #f9fafb;
}

.issue-item.high {
  border-left: 4px solid #ef4444;
}

.issue-item.medium {
  border-left: 4px solid #f59e0b;
}

.issue-item.low {
  border-left: 4px solid #10b981;
}

.issue-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.issue-priority {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.issue-priority.high {
  background: #fee2e2;
  color: #991b1b;
}

.issue-priority.medium {
  background: #fef3c7;
  color: #92400e;
}

.issue-priority.low {
  background: #dcfce7;
  color: #166534;
}

.issue-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.issue-status {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.issue-status.status-open {
  background: #fee2e2;
  color: #991b1b;
}

.issue-status.status-in-progress {
  background: #dbeafe;
  color: #1e40af;
}

.issue-status.status-resolved {
  background: #dcfce7;
  color: #166534;
}

.issue-status.status-planned {
  background: #fef3c7;
  color: #92400e;
}

.issue-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
}

.issue-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.meta-value.overdue {
  color: #dc2626;
  font-weight: 600;
}

.issue-actions {
  display: flex;
  justify-content: flex-end;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.action-btn.edit {
  color: #2563eb;
  border-color: #2563eb;
}

.action-btn.edit:hover {
  background: #dbeafe;
}

.action-btn.resolve {
  color: #059669;
  border-color: #059669;
}

.action-btn.resolve:hover {
  background: #dcfce7;
}

.action-btn.delete {
  color: #dc2626;
  border-color: #dc2626;
}

.action-btn.delete:hover {
  background: #fee2e2;
}

.action-icon {
  width: 14px;
  height: 14px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  color: #d1d5db;
}

.empty-state h4 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  margin: 0 0 20px 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .project-issues {
    padding: 16px;
  }

  .issues-summary-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: auto;
  }

  .filter-buttons {
    justify-content: center;
  }

  .issue-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .issue-meta {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>
