import { list, uploadData, getUrl, remove } from 'aws-amplify/storage';
import type { S3Object } from '@/interfaces/s3';

/**
 * List all objects in the S3 bucket
 */
export async function listObjects(): Promise<S3Object[]> {
  try {
    const path = 'uploads/';

    const result = await list({
      path: path,
      options: {
        listAll: true,
      },
    });

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
 * List all objects in a specific folder
 */
export async function listObjectsInFolder(folderPath: string): Promise<S3Object[]> {
  try {
    const result = await list({
      path: folderPath,
      options: {
        listAll: true,
      },
    });

    return result.items.map((item) => ({
      key: item.path,
      size: item.size,
      lastModified: item.lastModified,
      eTag: item.eTag,
    }));
  } catch (error) {
    console.error('Error listing objects in folder:', error);
    throw error;
  }
}

/**
 * Upload a file to S3
 */
export async function uploadFile(file: File, key?: string): Promise<string> {
  try {
    const fileName = key || file.name;
    const path = `uploads/${fileName}`;
    const result = await uploadData({
      path: path,
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
    await remove({
      path: key,
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Download an entire folder as a zip file
 */
export async function downloadFolder(folderPath: string, folderName?: string): Promise<void> {
  try {

    // List all objects in the folder
    const objects = await listObjectsInFolder(folderPath);

    if (objects.length === 0) {
      return;
    }

    // Import JSZip dynamically to avoid bundle size issues
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Download each file and add to zip
    for (const obj of objects) {
      try {
        const url = await getDownloadUrl(obj.key);
        const response = await fetch(url);
        const blob = await response.blob();

        // Extract filename from path for cleaner zip structure
        const fileName = obj.key.replace(folderPath, '').replace(/^\/+/, '');
        zip.file(fileName, blob);
      } catch (error) {
        console.error('Error downloading file for zip:', obj.key, error);
        // Continue with other files even if one fails
      }
    }

    // Generate and download the zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);

    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `${folderName || folderPath.replace(/[\/\\]/g, '_')}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(zipUrl);
  } catch (error) {
    console.error('Error downloading folder:', error);
    throw error;
  }
}
