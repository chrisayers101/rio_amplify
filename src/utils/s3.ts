import { list, uploadData, getUrl, remove } from 'aws-amplify/storage';
import type { S3Object } from '@/interfaces/s3';

/**
 * List all objects in the S3 bucket
 */
export async function listObjects(): Promise<S3Object[]> {
  try {
    console.log('Calling list with path: uploads/');
    const result = await list({
      path: 'uploads/',
      options: {
        listAll: true,
      },
    });

    console.log('Raw list result:', result);
    console.log('All items:', result.items);

    return result.items.map((item) => ({
      key: item.path,
      size: item.size,
      lastModified: item.lastModified,
      eTag: item.eTag,
    }));
  } catch (error) {
    console.error('Error listing objects:', error);
    throw error;
  }
}

/**
 * Upload a file to S3
 */
export async function uploadFile(file: File, key?: string): Promise<string> {
  try {
    const fileName = key || file.name;
    const result = await uploadData({
      path: `uploads/${fileName}`,
      data: file,
    }).result;

    return result.path;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Get a download URL for a file
 */
export async function getDownloadUrl(key: string): Promise<string> {
  try {
    const result = await getUrl({
      path: key,
      options: {
        validateObjectExistence: true,
      },
    });
    return result.url.toString();
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
}

/**
 * Delete a file from S3
 */
export async function deleteFile(key: string): Promise<void> {
  try {
    console.log('Deleting file with key:', key);
    await remove({
      path: key,
    });
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
