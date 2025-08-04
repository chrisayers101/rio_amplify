<template>
  <aside :class="['sidebar', { collapsed }]">

    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in navItems" :key="item.label">
          <router-link v-if="item.route" :to="item.route" class="sidebar-link" :class="{ active: isActive(item.route) }">
            <component :is="item.icon" class="sidebar-icon" />
            <div v-if="!collapsed" class="sidebar-text">
              <span class="sidebar-label">{{ item.label }}</span>
              <span class="sidebar-sub-label">{{ item.subLabel }}</span>
            </div>
          </router-link>
          <div v-else class="sidebar-link" :class="{ active: isActiveSection(item) }" @click="toggleSection(item.label)">
            <component :is="item.icon" class="sidebar-icon" />
            <div v-if="!collapsed" class="sidebar-text">
              <span class="sidebar-label">{{ item.label }}</span>
              <span class="sidebar-sub-label">{{ item.subLabel }}</span>
            </div>
            <ChevronDownIcon v-if="!collapsed" class="chevron" :class="{ 'rotated': isSectionExpanded(item.label) }" />
          </div>
          <ul v-if="item.children && !collapsed && isSectionExpanded(item.label)" class="sidebar-subnav">
            <li v-for="child in item.children" :key="child.label">
              <router-link v-if="child.route" :to="child.route" class="sidebar-link sub-link" :class="{ active: isActive(child.route) }">
                <component :is="child.icon" class="sidebar-icon" />
                <div class="sidebar-text">
                  <span class="sidebar-label">{{ child.label }}</span>
                  <span class="sidebar-sub-label">{{ child.subLabel }}</span>
                </div>
              </router-link>
              <div v-else class="sidebar-link sub-link">
                <component :is="child.icon" class="sidebar-icon" />
                <div class="sidebar-text">
                  <span class="sidebar-label">{{ child.label }}</span>
                  <span class="sidebar-sub-label">{{ child.subLabel }}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <button class="sidebar-toggle" @click="sidebarStore.toggleSidebar()">
      <ChevronLeftIcon v-if="collapsed" class="toggle-icon" />
      <ChevronRightIcon v-else class="toggle-icon" />
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebarStore'
import RioLogo from '@/assets/RioLogo.svg'
import {
  HomeIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  CircleStackIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const sidebarStore = useSidebarStore()

const collapsed = computed(() => sidebarStore.collapsed)

// Track which sections are expanded - default to showing Evaluation
const expandedSections = ref(new Set<string>(['Evaluation']))

const navItems = [
  {
    icon: HomeIcon,
    label: 'Home',
    route: '/home',
    subLabel: 'Project overview'
  },
  {
    icon: ChartBarIcon,
    label: 'Project Analytics',
    route: '/dashboard',
    subLabel: 'Analytics dashboard'
  },
  {
    icon: ClipboardDocumentListIcon,
    label: 'Evaluation',
    subLabel: 'Rio evaluation matrix',
    children: [
      {
        icon: CurrencyDollarIcon,
        label: 'Commercial (Contracts & Costs)',
        route: '/evaluation/commercial',
        subLabel: 'Contracts and cost evaluation'
      },
      {
        icon: ShieldCheckIcon,
        label: 'Health, Safety & Environment (HSE)',
        route: '/evaluation/hse',
        subLabel: 'HSE compliance and standards'
      },
      {
        icon: CpuChipIcon,
        label: 'Technical',
        route: '/evaluation/technical',
        subLabel: 'Technical requirements assessment'
      },
      {
        icon: CircleStackIcon,
        label: 'Asset Management and Lifecycle Costs',
        route: '/evaluation/asset',
        subLabel: 'Asset lifecycle cost analysis'
      },
      {
        icon: CalendarIcon,
        label: 'Schedule',
        route: '/evaluation/schedule',
        subLabel: 'Schedule and timeline evaluation'
      }
    ]
  }
]

const isActive = (routePath: string) => {
  return route.path === routePath
}

const isActiveSection = (item: any) => {
  return item.children?.some((child: any) => child.route === route.path)
}

const isSectionExpanded = (sectionLabel: string) => {
  return expandedSections.value.has(sectionLabel)
}

const toggleSection = (sectionLabel: string) => {
  if (expandedSections.value.has(sectionLabel)) {
    expandedSections.value.delete(sectionLabel)
  } else {
    expandedSections.value.add(sectionLabel)
  }
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #eee;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  transition: width 0.2s;
  position: fixed;
  left: 0;
  top: 64px;
  z-index: 50;
}
.sidebar.collapsed {
  width: 72px;
}
.sidebar-branding {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}
.sidebar-logo {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}
.sidebar-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #008C8E;
}
.sidebar-nav {
  flex: 1;
  padding: 0;
}
.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-nav li {
  margin: 0;
}
.sidebar-link {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
  border-radius: 0;
  transition: all 0.2s;
  position: relative;
  cursor: pointer;
}
.sidebar-link:hover {
  background: #f7f9fc;
}
.sidebar-link.active {
  background: #e6f7f8;
  color: #008C8E;
  border-right: 3px solid #008C8E;
}
.sidebar-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}
.sidebar-text {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.sidebar-label {
  font-weight: 500;
  font-size: 14px;
  line-height: 1.2;
}
.sidebar-sub-label {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}
.chevron {
  width: 16px;
  height: 16px;
  margin-left: auto;
  color: #888;
  transition: transform 0.2s ease;
}
.chevron.rotated {
  transform: rotate(180deg);
}
.sidebar-subnav {
  padding-left: 0;
  margin: 0;
}
.sidebar-subnav .sidebar-link {
  padding-left: 48px;
  padding-top: 8px;
  padding-bottom: 8px;
}
.sidebar-subnav .sidebar-link.active {
  background: #f0f9fa;
  color: #008C8E;
}
.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s;
}
.sidebar-toggle:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.toggle-icon {
  width: 12px;
  height: 12px;
  color: #888;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: calc(100vh - 64px);
    top: 64px;
    left: 0;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.collapsed {
    width: 100%;
    transform: translateX(-100%);
  }

  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .sidebar-toggle {
    right: 16px;
    top: 16px;
    z-index: 1001;
  }
}
</style>
