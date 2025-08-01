<template>
  <div class="navigation-aware-layout">
    <div class="flex-1 flex flex-col">
      <div class="flex-1 p-4">
        <h1 class="text-2xl font-bold text-theme-primary mb-4">Database Entities</h1>
        <p class="text-theme-secondary mb-6">
          Manage your database entities. Create, edit, and delete entities stored in DynamoDB.
        </p>

        <!-- DynamoDB Entities Section -->
        <div class="card mb-6">
          <h2 class="text-xl font-semibold text-theme-primary mb-4">Database Entities</h2>

          <!-- Create New Entity -->
          <div class="mb-6">
            <h3 class="text-lg font-medium text-theme-primary mb-3">Create New Entity</h3>
            <div class="flex items-center space-x-4">
              <input
                v-model="newEntityName"
                type="text"
                placeholder="Entity name"
                class="input-theme"
              />
              <input
                v-model="newEntityData"
                type="text"
                placeholder="Entity data"
                class="input-theme"
              />
              <button
                @click="createEntity"
                :disabled="entityStore.isLoading || !newEntityName.trim()"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ entityStore.isLoading ? 'Creating...' : 'Create Entity' }}
              </button>
            </div>
          </div>

          <!-- Entities List -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-medium text-theme-primary">Your Entities</h3>
              <button
                @click="refreshEntities"
                :disabled="entityStore.isLoading"
                class="btn-secondary text-sm disabled:opacity-50"
              >
                {{ entityStore.isLoading ? 'Loading...' : 'Refresh' }}
              </button>
            </div>

            <!-- Loading State -->
            <div v-if="entityStore.isLoading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-theme-red"></div>
              <p class="mt-2 text-theme-secondary">Loading entities...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="entityStore.entities.length === 0" class="text-center py-8">
              <div class="text-theme-tertiary mb-2">
                <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p class="text-theme-secondary">No entities created yet</p>
              <p class="text-sm text-theme-tertiary mt-1">Create your first entity to get started</p>
            </div>

            <!-- Entities List -->
            <div v-else class="space-y-2">
              <div
                v-for="entity in entityStore.entities"
                :key="entity.id"
                class="flex items-center justify-between p-3 bg-theme-secondary rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <div class="text-theme-green">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-theme-primary">{{ entity.name }}</p>
                    <p class="text-xs text-theme-secondary">
                      ID: {{ entity.id }}
                      <span v-if="entity.data" class="ml-2">
                        • Data: {{ entity.data }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    v-if="editingEntity?.id !== entity.id"
                    @click="startEdit(entity)"
                    class="btn-primary text-xs py-1 px-3"
                  >
                    Edit
                  </button>
                  <button
                    v-else
                    @click="saveEdit"
                    class="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                  <button
                    v-if="editingEntity?.id === entity.id"
                    @click="cancelEdit"
                    class="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    @click="deleteEntity(entity.id)"
                    class="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <!-- Edit Form -->
              <div v-if="editingEntity" class="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Edit Entity</h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <input
                      v-model="editName"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Data</label>
                    <input
                      v-model="editData"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEntityStore } from '@/stores/entityStore';
import { useAuthStore } from '@/stores/authStore';
import type { Entity } from '@/stores/entityStore';

// Initialize stores
const entityStore = useEntityStore();
const authStore = useAuthStore();

// Form data for new entity
const newEntityName = ref('');
const newEntityData = ref('');

// Edit state
const editingEntity = ref<Entity | null>(null);
const editName = ref('');
const editData = ref('');

// Load data on component mount
onMounted(async () => {
  // Only fetch entities if user is authenticated
  if (authStore.isAuthenticated) {
    await entityStore.fetchEntities();
  }
});

// Entity functions using store - only call when authenticated
async function refreshEntities() {
  if (!authStore.isAuthenticated) {
    console.log('User not authenticated, skipping entity fetch');
    return;
  }
  await entityStore.fetchEntities();
}

async function createEntity() {
  if (!authStore.isAuthenticated) {
    console.log('User not authenticated, cannot create entity');
    return;
  }

  if (!newEntityName.value.trim()) return;

  const result = await entityStore.createEntity(newEntityName.value, newEntityData.value);

  if (result) {
    // Clear form
    newEntityName.value = '';
    newEntityData.value = '';
  }
}

function startEdit(entity: Entity) {
  editingEntity.value = entity;
  editName.value = entity.name || '';
  editData.value = entity.data || '';
}

function cancelEdit() {
  editingEntity.value = null;
  editName.value = '';
  editData.value = '';
}

async function saveEdit() {
  if (!authStore.isAuthenticated || !editingEntity.value) {
    console.log('User not authenticated or no entity to edit');
    return;
  }

  if (!editName.value.trim()) return;

  await entityStore.updateEntity(editingEntity.value.id, editName.value, editData.value);
  cancelEdit();
}

async function deleteEntity(id: string) {
  if (!authStore.isAuthenticated) {
    console.log('User not authenticated, cannot delete entity');
    return;
  }

  await entityStore.deleteEntity(id);
}
</script>
