<template>
  <div class="guidelines-example">
    <h2>Guidelines Store Example</h2>

    <!-- Loading State -->
    <div v-if="guidelinesStore.isLoading" class="loading">
      Loading guidelines...
    </div>

    <!-- Error State -->
    <div v-else-if="guidelinesStore.error" class="error">
      Error: {{ guidelinesStore.error }}
    </div>

    <!-- Content -->
    <div v-else class="content">
      <!-- Summary Stats -->
      <div class="stats">
        <p>Total Sections: {{ guidelinesStore.sectionCount }}</p>
        <p v-if="guidelinesStore.selectedSection">
          Selected: {{ guidelinesStore.selectedSection.sectionName }}
        </p>
      </div>

      <!-- Search -->
      <div class="search">
        <input
          v-model="searchTerm"
          placeholder="Search guidelines..."
          @input="handleSearch"
          class="search-input"
        />
        <button @click="clearSearch" class="clear-btn">Clear</button>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="search-results">
        <h3>Search Results ({{ searchResults.length }})</h3>
        <div
          v-for="result in searchResults"
          :key="result.section.id"
          class="search-result-item"
          @click="selectSection(result.section.id)"
        >
          <h4>{{ result.section.sectionName }}</h4>
          <p>Relevance: {{ result.relevanceScore }}</p>
          <p>Matched: {{ result.matchedFields.join(', ') }}</p>
        </div>
      </div>

      <!-- Category Navigation -->
      <div class="categories">
        <h3>Categories</h3>
        <div class="category-buttons">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectCategory(category)"
            class="category-btn"
          >
            {{ formatCategoryName(category) }}
          </button>
        </div>
      </div>

      <!-- Category Sections -->
      <div v-if="selectedCategory" class="category-sections">
        <h3>{{ formatCategoryName(selectedCategory) }} Sections</h3>
        <div
          v-for="section in categorySections"
          :key="section.id"
          class="section-item"
          @click="selectSection(section.id)"
        >
          <h4>{{ section.sectionName }}</h4>
          <p class="section-preview">{{ getSectionPreview(section) }}</p>
        </div>
      </div>

      <!-- Selected Section Details -->
      <div v-if="guidelinesStore.selectedSection" class="selected-section">
        <h3>Selected Section: {{ guidelinesStore.selectedSection.sectionName }}</h3>
        <div class="markdown-content">
          <pre>{{ guidelinesStore.selectedSection.markdown }}</pre>
        </div>
        <button @click="clearSelection" class="clear-selection-btn">
          Clear Selection
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGuidelinesStore } from '@/stores/guidelinesStore'
import type { GuidelineCategory } from '../../shared'

const guidelinesStore = useGuidelinesStore()

// Local state
const searchTerm = ref('')
const searchResults = ref<ReturnType<typeof guidelinesStore.searchSections>>([])
const selectedCategory = ref<GuidelineCategory | null>(null)

// Computed
const categories: GuidelineCategory[] = ['summary', 'business', 'technical', 'execution', 'analysis']

const categorySections = computed(() => {
  if (!selectedCategory.value) return []
  return guidelinesStore.getSectionsByCategory(selectedCategory.value)
})

// Methods
const handleSearch = () => {
  if (searchTerm.value.trim()) {
    searchResults.value = guidelinesStore.searchSections(searchTerm.value)
  } else {
    searchResults.value = []
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  searchResults.value = []
}

const selectCategory = (category: GuidelineCategory) => {
  selectedCategory.value = category
}

const selectSection = (sectionId: string) => {
  guidelinesStore.selectSectionById(sectionId)
}

const clearSelection = () => {
  guidelinesStore.clearSelection()
}

const formatCategoryName = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const getSectionPreview = (section: any): string => {
  const content = section.markdown || ''
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}

// Lifecycle
onMounted(async () => {
  await guidelinesStore.initializeGuidelines()
})
</script>

<style scoped>
.guidelines-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.error {
  color: #dc3545;
}

.stats {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.search {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.clear-btn {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-results {
  margin-bottom: 20px;
}

.search-result-item {
  background: #e9ecef;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-result-item:hover {
  background: #dee2e6;
}

.categories {
  margin-bottom: 20px;
}

.category-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.category-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.category-btn:hover {
  background: #0056b3;
}

.category-sections {
  margin-bottom: 20px;
}

.section-item {
  background: #f8f9fa;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.section-item:hover {
  background: #e9ecef;
}

.section-preview {
  color: #6c757d;
  font-size: 14px;
  margin-top: 5px;
}

.selected-section {
  background: #fff3cd;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ffeaa7;
}

.markdown-content {
  background: white;
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;
  max-height: 400px;
  overflow-y: auto;
}

.markdown-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.clear-selection-btn {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.clear-selection-btn:hover {
  background: #c82333;
}
</style>
