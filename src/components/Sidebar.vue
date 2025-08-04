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
          <div v-else class="sidebar-link" :class="{ active: isActiveSection(item) }">
            <component :is="item.icon" class="sidebar-icon" />
            <div v-if="!collapsed" class="sidebar-text">
              <span class="sidebar-label">{{ item.label }}</span>
              <span class="sidebar-sub-label">{{ item.subLabel }}</span>
            </div>
            <ChevronDownIcon v-if="!collapsed" class="chevron" />
          </div>
          <ul v-if="item.children && !collapsed" class="sidebar-subnav">
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
    <div class="sidebar-footer" v-if="!collapsed">
      <div class="sidebar-user">
        <img :src="user.avatar" alt="User" class="sidebar-avatar" />
        <div class="sidebar-user-info">
          <div class="sidebar-username">{{ user.name }}</div>
          <div class="sidebar-email">{{ user.email }}</div>
        </div>
      </div>
    </div>
    <button class="sidebar-toggle" @click="collapsed = !collapsed">
      <ChevronLeftIcon v-if="collapsed" class="toggle-icon" />
      <ChevronRightIcon v-else class="toggle-icon" />
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { user } from '@/mockdata/mockData'
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
const collapsed = ref(false)

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
  overflow-y: auto;
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
  overflow-y: auto;
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
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #eee;
  background: #f7f9fc;
}
.sidebar-user {
  display: flex;
  align-items: center;
}
.sidebar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
}
.sidebar-user-info {
  flex: 1;
}
.sidebar-username {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}
.sidebar-email {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}
.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: 1px solid #eee;
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
