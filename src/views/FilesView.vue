<template>
  <div class="navigation-aware-layout">
    <div class="flex-1 flex flex-col">
      <div class="flex-1 p-4">
        <h1 class="text-2xl font-bold text-theme-primary mb-4">File Storage</h1>
        <p class="text-theme-secondary mb-6">
          Manage your files in S3 storage. Upload, download, and delete files from your cloud storage.
        </p>

        <!-- Bucket Selector -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-theme-primary mb-3">Select Storage Bucket</h3>
          <div class="flex items-center space-x-4">
            <button
              @click="selectBucket('default')"
              :class="[
                'px-4 py-2 rounded-lg border transition-all',
                selectedBucket === 'default'
                  ? 'bg-theme-blue text-white border-theme-blue'
                  : 'bg-white text-theme-primary border-gray-300 hover:bg-gray-50'
              ]"
            >
              Default Bucket
            </button>
            <button
              v-for="bucket in existingBuckets"
              :key="bucket.name"
              @click="selectBucket(bucket.name)"
              :class="[
                'px-4 py-2 rounded-lg border transition-all',
                selectedBucket === bucket.name
                  ? 'bg-theme-blue text-white border-theme-blue'
                  : 'bg-white text-theme-primary border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ bucket.displayName }}
            </button>
          </div>
          <p class="text-sm text-theme-secondary mt-2">
            All buckets are now available through the S3 proxy function.
          </p>
        </div>

        <!-- S3 Storage Section -->
        <div class="card mb-6">
          <h2 class="text-xl font-semibold text-theme-primary mb-4">
            File Storage - {{ getCurrentBucketDisplayName() }}
          </h2>

          <!-- Upload Section -->
          <div class="mb-6">
            <h3 class="text-lg font-medium text-theme-primary mb-3">Upload Files</h3>
            <div class="flex items-center space-x-4">
              <input
                ref="fileInput"
                type="file"
                @change="handleFileSelect"
                class="hidden"
                multiple
              />
              <button
                @click="() => fileInput?.click()"
                class="btn-blue"
              >
                Choose Files
              </button>
              <button
                v-if="selectedFiles.length > 0"
                @click="uploadFiles"
                :disabled="uploading"
                class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}` }}
              </button>
            </div>

            <!-- Selected Files Preview -->
            <div v-if="selectedFiles.length > 0" class="mt-3">
              <p class="text-sm text-theme-secondary mb-2">Selected files:</p>
              <ul class="space-y-1">
                <li v-for="file in selectedFiles" :key="file.name" class="text-sm text-theme-primary">
                  {{ file.name }} ({{ formatFileSize(file.size) }})
                </li>
              </ul>
            </div>
          </div>

                      <!-- Files List -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-medium text-theme-primary">Your Files</h3>
                <div class="flex items-center space-x-2">
                  <button
                    v-if="files.length > 0"
                    @click="downloadAllFiles"
                    :disabled="downloadingAll"
                    class="btn-secondary text-sm disabled:opacity-50"
                  >
                    {{ downloadingAll ? 'Downloading...' : 'Download All' }}
                  </button>
                  <button
                    @click="refreshFiles"
                    :disabled="loading"
                    class="btn-secondary text-sm disabled:opacity-50"
                  >
                    {{ loading ? 'Loading...' : 'Refresh' }}
                  </button>
                </div>
              </div>

              <!-- Search Bar -->
              <div class="mb-4">
                <div class="relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search files by name..."
                    class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-blue focus:border-transparent"
                  />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button
                    v-if="searchQuery"
                    @click="clearSearch"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div v-if="searchQuery" class="mt-2 text-sm text-theme-secondary">
                  Showing {{ filteredFiles.length }} of {{ files.length }} files
                </div>
              </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-theme-red"></div>
              <p class="mt-2 text-theme-secondary">Loading files...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredFiles.length === 0" class="text-center py-8">
              <div class="text-theme-tertiary mb-2">
                <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p class="text-theme-secondary">
                {{ searchQuery ? 'No files match your search' : 'No files uploaded yet' }}
              </p>
              <p class="text-sm text-theme-tertiary mt-1">
                {{ searchQuery ? 'Try a different search term' : 'Upload your first file to get started' }}
              </p>
            </div>

            <!-- Files List -->
            <div v-else class="space-y-2">
              <div
                v-for="file in filteredFiles"
                :key="file.key"
                class="flex items-center justify-between p-3 bg-theme-secondary rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <div class="text-theme-blue">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 012-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-theme-primary">{{ file.key }}</p>
                    <p class="text-xs text-theme-secondary">
                      {{ file.size ? formatFileSize(file.size) : 'Unknown size' }}
                      <span v-if="file.lastModified" class="ml-2">
                        • {{ formatDate(file.lastModified) }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="downloadFile(file.key)"
                    class="btn-primary text-xs py-1 px-3"
                  >
                    Download
                  </button>
                  <button
                    @click="deleteFile(file.key)"
                    class="btn-primary text-xs py-1 px-3 bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </button>
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
import { ref, onMounted, computed } from 'vue';
import { listObjects, uploadFile, getDownloadUrl, deleteFile as deleteS3File, downloadFolder } from '@/utils/s3';
import {
  existingBuckets,
  listAllObjectsFromExistingBucket,
  uploadFileToExistingBucket,
  getDownloadUrlFromExistingBucket,
  deleteFileFromExistingBucket,
  downloadFolderFromExistingBucket
} from '@/utils/existingBuckets';
import type { S3Object } from '../../shared/interfaces';

// Reactive state for files
const files = ref<S3Object[]>([]);
const selectedFiles = ref<File[]>([]);
const loading = ref(false);
const uploading = ref(false);
const downloadingAll = ref(false);
const fileInput = ref<HTMLInputElement>();
const selectedBucket = ref('default');
const searchQuery = ref('');

// Computed properties
const filteredFiles = computed(() => {
  if (!searchQuery.value) {
    return files.value;
  }

  const query = searchQuery.value.toLowerCase();
  return files.value.filter(file =>
    file.key.toLowerCase().includes(query)
  );
});

// Search functions
function clearSearch() {
  searchQuery.value = '';
}

// Load data on component mount
onMounted(async () => {
  refreshFiles();
});

// Bucket functions
function selectBucket(bucketName: string) {
  selectedBucket.value = bucketName;
  refreshFiles();
}

function getCurrentBucketDisplayName(): string {
  if (selectedBucket.value === 'default') {
    return 'Default Bucket';
  }
  const bucket = existingBuckets.find(b => b.name === selectedBucket.value);
  return bucket?.displayName || 'Unknown Bucket';
}

function getCurrentBucketConfig() {
  if (selectedBucket.value === 'default') {
    return null;
  }
  return existingBuckets.find(b => b.name === selectedBucket.value);
}

// File functions
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFiles.value = Array.from(target.files);
  }
}

async function uploadFiles() {
  if (selectedFiles.value.length === 0) return;

  uploading.value = true;
  try {


    if (selectedBucket.value === 'default') {
      // Use Amplify storage for default bucket
      for (const file of selectedFiles.value) {
        const result = await uploadFile(file);
      }
    } else {
      // Use AWS SDK for existing buckets
      const bucketConfig = getCurrentBucketConfig();
      if (!bucketConfig) {
        throw new Error('Invalid bucket configuration');
      }

      for (const file of selectedFiles.value) {
        const result = await uploadFileToExistingBucket(file, bucketConfig.bucketName);
      }
    }

    // Clear selected files and refresh the list
    selectedFiles.value = [];
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    await refreshFiles();
  } catch (error) {
    console.error('Error uploading files:', error);
  } finally {
    uploading.value = false;
  }
}

async function refreshFiles() {
  loading.value = true;
  try {


    if (selectedBucket.value === 'default') {
      // Use Amplify storage for default bucket
      const result = await listObjects();
      files.value = result;
    } else {
      // Use AWS SDK for existing buckets
      const bucketConfig = getCurrentBucketConfig();
      if (!bucketConfig) {
        throw new Error('Invalid bucket configuration');
      }

      const result = await listAllObjectsFromExistingBucket(bucketConfig.bucketName);
      files.value = result;
    }


  } catch (error) {
    console.error('Error loading files:', error);
  } finally {
    loading.value = false;
  }
}

async function downloadAllFiles() {
  if (files.value.length === 0) return;

  downloadingAll.value = true;
  try {


    if (selectedBucket.value === 'default') {
      // Use Amplify storage for default bucket
      await downloadFolder('uploads/', 'all-files');
    } else {
      // Use AWS SDK for existing buckets
      const bucketConfig = getCurrentBucketConfig();
      if (!bucketConfig) {
        throw new Error('Invalid bucket configuration');
      }

      await downloadFolderFromExistingBucket(bucketConfig.bucketName, '', `${bucketConfig.displayName.toLowerCase().replace(/\s+/g, '-')}-files`);
    }


  } catch (error) {
    console.error('Error downloading all files:', error);
  } finally {
    downloadingAll.value = false;
  }
}

async function downloadFile(key: string) {
  try {
    let url: string;

    if (selectedBucket.value === 'default') {
      // Use Amplify storage for default bucket
      url = await getDownloadUrl(key);
    } else {
      // Use AWS SDK for existing buckets
      const bucketConfig = getCurrentBucketConfig();
      if (!bucketConfig) {
        throw new Error('Invalid bucket configuration');
      }

      url = await getDownloadUrlFromExistingBucket(key, bucketConfig.bucketName);
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = key;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}

async function deleteFile(key: string) {
  try {
    if (selectedBucket.value === 'default') {
      // Use Amplify storage for default bucket
      await deleteS3File(key);
    } else {
      // Use AWS SDK for existing buckets
      const bucketConfig = getCurrentBucketConfig();
      if (!bucketConfig) {
        throw new Error('Invalid bucket configuration');
      }

      await deleteFileFromExistingBucket(key, bucketConfig.bucketName);
    }

    await refreshFiles();
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

// Utility functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return 'Unknown';

  // Convert string to Date if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}
</script>
