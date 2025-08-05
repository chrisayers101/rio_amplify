<template>
  <div class="navigation-aware-layout">
    <div class="flex-1 flex flex-col">
      <div class="flex-1 p-4">
        <h1 class="text-2xl font-bold text-theme-primary mb-4">File Storage</h1>
        <p class="text-theme-secondary mb-6">
          Manage your files in S3 storage. Upload, download, and delete files from your cloud storage.
        </p>

        <!-- S3 Storage Section -->
        <div class="card mb-6">
          <h2 class="text-xl font-semibold text-theme-primary mb-4">File Storage</h2>

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

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-theme-red"></div>
              <p class="mt-2 text-theme-secondary">Loading files...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="files.length === 0" class="text-center py-8">
              <div class="text-theme-tertiary mb-2">
                <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p class="text-theme-secondary">No files uploaded yet</p>
              <p class="text-sm text-theme-tertiary mt-1">Upload your first file to get started</p>
            </div>

            <!-- Files List -->
            <div v-else class="space-y-2">
              <div
                v-for="file in files"
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
import { ref, onMounted } from 'vue';
import { listObjects, uploadFile, getDownloadUrl, deleteFile as deleteS3File, downloadFolder } from '@/utils/s3';
import type { S3Object } from '@/interfaces/s3';

// Reactive state for files
const files = ref<S3Object[]>([]);
const selectedFiles = ref<File[]>([]);
const loading = ref(false);
const uploading = ref(false);
const downloadingAll = ref(false);
const fileInput = ref<HTMLInputElement>();

// Load data on component mount
onMounted(async () => {
  refreshFiles();
});

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
    console.log('Starting upload of', selectedFiles.value.length, 'files');
    for (const file of selectedFiles.value) {
      console.log('Uploading file:', file.name);
      const result = await uploadFile(file);
      console.log('Upload result:', result);
    }

    // Clear selected files and refresh the list
    selectedFiles.value = [];
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    console.log('Refreshing file list...');
    await refreshFiles();
    console.log('File list refreshed, total files:', files.value.length);
  } catch (error) {
    console.error('Error uploading files:', error);
  } finally {
    uploading.value = false;
  }
}

async function refreshFiles() {
  loading.value = true;
  try {
    console.log('Calling listObjects...');
    const result = await listObjects();
    console.log('List objects result:', result);
    files.value = result;
    console.log('Files array updated:', files.value);
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
    console.log('Starting download of all files');
    await downloadFolder('uploads/', 'all-files');
    console.log('All files downloaded successfully');
  } catch (error) {
    console.error('Error downloading all files:', error);
  } finally {
    downloadingAll.value = false;
  }
}

async function downloadFile(key: string) {
  try {
    const url = await getDownloadUrl(key);
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
    await deleteS3File(key);
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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
</script>
