import type { S3Object, ExistingBucketConfig } from '../../shared';
import {
  listObjectsFromExistingBucket as listObjectsFromProxy,
  listAllObjectsFromExistingBucket as listAllObjectsFromProxy,
  uploadFileToExistingBucket as uploadFileToProxy,
  generateDownloadUrlForExistingBucket,
  deleteFileFromExistingBucket as deleteFileFromProxy,
  downloadFolderFromExistingBucket as downloadFolderFromProxy
} from './s3Proxy';

export const existingBuckets: ExistingBucketConfig[] = [
  {
    name: 'airis',
    displayName: 'Airis Storage',
    bucketName: 'airis-analytica-workspace-sharepoint-data-962000089408'
  },
  {
    name: 'ak',
    displayName: 'AK Experimental',
    bucketName: 'ak-bkt-exp-1'
  }
];

/**
 * List objects in an existing S3 bucket using the proxy
 */
export async function listObjectsFromExistingBucket(bucketName: string, prefix: string = ''): Promise<S3Object[]> {
  try {
    const response = await listObjectsFromProxy(bucketName, prefix);
    return response.objects;
  } catch (error) {
    console.error('Error listing objects from existing bucket:', error);
    throw error;
  }
}

/**
 * List ALL objects in an existing S3 bucket with automatic pagination
 * This function handles pagination automatically to retrieve all files
 */
export async function listAllObjectsFromExistingBucket(bucketName: string, prefix: string = ''): Promise<S3Object[]> {
  try {
    return await listAllObjectsFromProxy(bucketName, prefix);
  } catch (error) {
    console.error('Error listing all objects from existing bucket:', error);
    throw error;
  }
}

/**
 * Upload a file to an existing S3 bucket using the proxy
 */
export async function uploadFileToExistingBucket(
  file: File,
  bucketName: string,
  key?: string
): Promise<string> {
  try {
    return await uploadFileToProxy(file, bucketName, key);
  } catch (error) {
    console.error('Error uploading file to existing bucket:', error);
    throw error;
  }
}

/**
 * Get a download URL for a file from an existing S3 bucket using the proxy
 */
export async function getDownloadUrlFromExistingBucket(key: string, bucketName: string): Promise<string> {
  try {
    const response = await generateDownloadUrlForExistingBucket(bucketName, key);
    return response.downloadUrl;
  } catch (error) {
    console.error('Error getting download URL from existing bucket:', error);
    throw error;
  }
}

/**
 * Delete a file from an existing S3 bucket using the proxy
 */
export async function deleteFileFromExistingBucket(key: string, bucketName: string): Promise<void> {
  try {
    await deleteFileFromProxy(bucketName, key);
  } catch (error) {
    console.error('Error deleting file from existing bucket:', error);
    throw error;
  }
}

/**
 * Download an entire folder as a zip file from an existing S3 bucket using the proxy
 */
export async function downloadFolderFromExistingBucket(
  bucketName: string,
  folderPath: string = '',
  folderName?: string
): Promise<void> {
  try {
    await downloadFolderFromProxy(bucketName, folderPath, folderName);
  } catch (error) {
    console.error('Error downloading folder from existing bucket:', error);
    throw error;
  }
}
