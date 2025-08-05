import type { S3Object } from '@/interfaces/s3';

export interface ExistingBucketConfig {
  name: string;
  displayName: string;
  bucketName: string;
}

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

// Placeholder functions that throw errors to indicate the buckets are not yet available
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function listObjectsFromExistingBucket(_bucketName: string, _prefix: string = 'uploads/'): Promise<S3Object[]> {
  throw new Error('Existing buckets are not yet available. CORS configuration required.');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function uploadFileToExistingBucket(
  _file: File,
  _bucketName: string,
  _key?: string
): Promise<string> {
  throw new Error('Existing buckets are not yet available. CORS configuration required.');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getDownloadUrlFromExistingBucket(_key: string, _bucketName: string): Promise<string> {
  throw new Error('Existing buckets are not yet available. CORS configuration required.');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteFileFromExistingBucket(_key: string, _bucketName: string): Promise<void> {
  throw new Error('Existing buckets are not yet available. CORS configuration required.');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function downloadFolderFromExistingBucket(
  _bucketName: string,
  _folderPath: string = 'uploads/',
  _folderName?: string
): Promise<void> {
  throw new Error('Existing buckets are not yet available. CORS configuration required.');
}
