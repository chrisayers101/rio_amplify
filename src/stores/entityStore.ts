import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { generateClient } from 'aws-amplify/data'
import { getCurrentUser } from 'aws-amplify/auth'

// Lazy initialization of Amplify Data client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any = null

const getClient = () => {
  if (!client) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client = generateClient() as any
    } catch (error) {
      console.error('Failed to initialize Amplify client:', error)
      throw new Error('Amplify has not been configured. Please call Amplify.configure() before using this service.')
    }
  }
  return client
}

// Type for our entity
export interface Entity {
  id: string
  name?: string | null
  data?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface EntityState {
  entities: Entity[]
  isLoading: boolean
  error: string | null
}

export const useEntityStore = defineStore('entity', () => {
  // State
  const entities = ref<Entity[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const entityCount = computed(() => entities.value.length)
  const hasEntities = computed(() => entities.value.length > 0)

  // Helper function to check authentication
  const checkAuthentication = async (): Promise<boolean> => {
    try {
      await getCurrentUser()
      return true
    } catch {
      console.log('User not authenticated for entity operations')
      error.value = 'Authentication required'
      return false
    }
  }

  // Actions
  const fetchEntities = async (): Promise<void> => {
    if (!(await checkAuthentication())) return

    isLoading.value = true
    error.value = null

    try {
      console.log('Fetching entities...')
      const { data: entitiesList, errors } = await getClient().models.defaultDynamoTable.list({})

      if (errors) {
        console.error('Errors fetching entities:', errors)
        error.value = 'Failed to fetch entities'
        return
      }

      entities.value = entitiesList
      console.log('Entities loaded:', entities.value)
    } catch (err) {
      console.error('Error loading entities:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load entities'
    } finally {
      isLoading.value = false
    }
  }

  const createEntity = async (name: string, data: string = ''): Promise<Entity | null> => {
    if (!(await checkAuthentication())) return null

    if (!name.trim()) {
      error.value = 'Entity name is required'
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      console.log('Creating entity:', { name, data })
      const { data: newEntity, errors } = await getClient().models.defaultDynamoTable.create({
        name: name.trim(),
        data: data.trim(),
      })

      if (errors) {
        console.error('Errors creating entity:', errors)
        error.value = 'Failed to create entity'
        return null
      }

      if (!newEntity) {
        error.value = 'Failed to create entity'
        return null
      }

      console.log('Entity created:', newEntity)

      // Add to local state
      entities.value.push(newEntity)

      return newEntity
    } catch (err) {
      console.error('Error creating entity:', err)
      error.value = err instanceof Error ? err.message : 'Failed to create entity'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateEntity = async (id: string, name: string, data: string = ''): Promise<Entity | null> => {
    if (!(await checkAuthentication())) return null

    if (!name.trim()) {
      error.value = 'Entity name is required'
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      console.log('Updating entity:', id, { name, data })
      const { data: updatedEntity, errors } = await getClient().models.defaultDynamoTable.update({
        id,
        name: name.trim(),
        data: data.trim(),
      })

      if (errors) {
        console.error('Errors updating entity:', errors)
        error.value = 'Failed to update entity'
        return null
      }

      if (!updatedEntity) {
        error.value = 'Failed to update entity'
        return null
      }

      console.log('Entity updated:', updatedEntity)

      // Update in local state
      const index = entities.value.findIndex((e: Entity) => e.id === id)
      if (index !== -1) {
        entities.value[index] = updatedEntity
      }

      return updatedEntity
    } catch (err) {
      console.error('Error updating entity:', err)
      error.value = err instanceof Error ? err.message : 'Failed to update entity'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteEntity = async (id: string): Promise<boolean> => {
    if (!(await checkAuthentication())) return false

    isLoading.value = true
    error.value = null

    try {
      console.log('Deleting entity:', id)
      const { errors } = await getClient().models.defaultDynamoTable.delete({ id })

      if (errors) {
        console.error('Errors deleting entity:', errors)
        error.value = 'Failed to delete entity'
        return false
      }

      console.log('Entity deleted successfully')

      // Remove from local state
      entities.value = entities.value.filter((e: Entity) => e.id !== id)

      return true
    } catch (err) {
      console.error('Error deleting entity:', err)
      error.value = err instanceof Error ? err.message : 'Failed to delete entity'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  const clearEntities = (): void => {
    entities.value = []
    error.value = null
  }

  const getEntityById = (id: string): Entity | undefined => {
    return entities.value.find((entity: Entity) => entity.id === id)
  }

  return {
    // State
    entities: readonly(entities),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Computed
    entityCount,
    hasEntities,

    // Actions
    fetchEntities,
    createEntity,
    updateEntity,
    deleteEntity,
    clearError,
    clearEntities,
    getEntityById
  }
})
