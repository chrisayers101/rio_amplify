import { generateClient } from 'aws-amplify/api';
import type { S3Object } from '@/interfaces/s3';

// Type definitions for S3 proxy operations
export interface S3ProxyListResponse {
  objects: S3Object[];
  isTruncated: boolean;
  nextContinuationToken?: string;
}

export interface S3ProxyUploadResponse {
  uploadUrl: string;
  key: string;
  bucketName: string;
}

export interface S3ProxyDownloadResponse {
  downloadUrl: string;
  key: string;
  bucketName: string;
}

export interface S3ProxySignedUrlResponse {
  signedUrl: string;
  key: string;
  bucketName: string;
}

export interface S3ProxyDeleteResponse {
  message: string;
  key: string;
  bucketName: string;
}

/**
 * List objects in an existing S3 bucket
 */
export async function listObjectsFromExistingBucket(
  bucketName: string,
  prefix: string = '',
  maxKeys: number = 1000,
  continuationToken?: string
): Promise<S3ProxyListResponse> {
  try {
    const client = generateClient();
    const response = await client.graphql({
      query: `
        query S3ProxyList($operation: String!, $bucketName: String!, $prefix: String, $maxKeys: Int, $continuationToken: String) {
          s3Proxy(operation: $operation, bucketName: $bucketName, prefix: $prefix, maxKeys: $maxKeys, continuationToken: $continuationToken)
        }
      `,
      variables: {
        operation: 'list',
        bucketName,
        prefix: prefix || '',
        maxKeys: maxKeys || 0,
        continuationToken: continuationToken || ''
      }
    });

    const result = JSON.parse((response as any).data.s3Proxy);
    if (!result.success) {
      throw new Error(result.error || 'Failed to list objects');
    }

    return result.data;
  } catch (error) {
    console.error('Error listing objects from existing bucket:', error);
    throw error;
  }
}

/**
 * Generate a signed URL for uploading a file to an existing S3 bucket
 */
export async function generateUploadUrlForExistingBucket(
  bucketName: string,
  key: string,
  contentType?: string,
  expiresIn: number = 3600
): Promise<S3ProxyUploadResponse> {
  try {
    const client = generateClient();
    const response = await client.graphql({
      query: `
        query S3ProxyUpload($operation: String!, $bucketName: String!, $key: String!, $contentType: String, $expiresIn: Int) {
          s3Proxy(operation: $operation, bucketName: $bucketName, key: $key, contentType: $contentType, expiresIn: $expiresIn)
        }
      `,
      variables: {
        operation: 'upload',
        bucketName,
        key: key || '',
        contentType: contentType || '',
        expiresIn: expiresIn || 3600
      }
    });

    const result = JSON.parse((response as any).data.s3Proxy);
    if (!result.success) {
      throw new Error(result.error || 'Failed to generate upload URL');
    }

    return result.data;
  } catch (error) {
    console.error('Error generating upload URL for existing bucket:', error);
    throw error;
  }
}

/**
 * Generate a signed URL for downloading a file from an existing S3 bucket
 */
export async function generateDownloadUrlForExistingBucket(
  bucketName: string,
  key: string,
  expiresIn: number = 3600
): Promise<S3ProxyDownloadResponse> {
  try {
    const client = generateClient();
    const response = await client.graphql({
      query: `
        query S3ProxyDownload($operation: String!, $bucketName: String!, $key: String!, $expiresIn: Int) {
          s3Proxy(operation: $operation, bucketName: $bucketName, key: $key, expiresIn: $expiresIn)
        }
      `,
      variables: {
        operation: 'download',
        bucketName,
        key: key || '',
        expiresIn: expiresIn || 3600
      }
    });

    const result = JSON.parse((response as any).data.s3Proxy);
    if (!result.success) {
      throw new Error(result.error || 'Failed to generate download URL');
    }

    return result.data;
  } catch (error) {
    console.error('Error generating download URL for existing bucket:', error);
    throw error;
  }
}

/**
 * Generate a signed URL for accessing a file in an existing S3 bucket
 */
export async function generateSignedUrlForExistingBucket(
  bucketName: string,
  key: string,
  expiresIn: number = 3600
): Promise<S3ProxySignedUrlResponse> {
  try {
    const client = generateClient();
    const response = await client.graphql({
      query: `
        query S3ProxySignedUrl($operation: String!, $bucketName: String!, $key: String!, $expiresIn: Int) {
          s3Proxy(operation: $operation, bucketName: $bucketName, key: $key, expiresIn: $expiresIn)
        }
      `,
      variables: {
        operation: 'getSignedUrl',
        bucketName,
        key: key || '',
        expiresIn: expiresIn || 3600
      }
    });

    const result = JSON.parse((response as any).data.s3Proxy);
    if (!result.success) {
      throw new Error(result.error || 'Failed to generate signed URL');
    }

    return result.data;
  } catch (error) {
    console.error('Error generating signed URL for existing bucket:', error);
    throw error;
  }
}

/**
 * Delete a file from an existing S3 bucket
 */
export async function deleteFileFromExistingBucket(
  bucketName: string,
  key: string
): Promise<S3ProxyDeleteResponse> {
  try {
    const client = generateClient();
    const response = await client.graphql({
      query: `
        query S3ProxyDelete($operation: String!, $bucketName: String!, $key: String!) {
          s3Proxy(operation: $operation, bucketName: $bucketName, key: $key)
        }
      `,
      variables: {
        operation: 'delete',
        bucketName,
        key: key || ''
      }
    });

    const result = JSON.parse((response as any).data.s3Proxy);
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete file');
    }

    return result.data;
  } catch (error) {
    console.error('Error deleting file from existing bucket:', error);
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
    const fileName = key || file.name;
    const contentType = file.type || getContentType(file.name);

    // Generate upload URL
    const uploadResponse = await generateUploadUrlForExistingBucket(
      bucketName,
      fileName,
      contentType
    );

    // Upload the file using the signed URL
    const uploadResult = await fetch(uploadResponse.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': contentType,
      },
    });

    if (!uploadResult.ok) {
      throw new Error(`Upload failed: ${uploadResult.statusText}`);
    }

    return fileName;
  } catch (error) {
    console.error('Error uploading file to existing bucket:', error);
    throw error;
  }
}

/**
 * Download a file from an existing S3 bucket
 */
export async function downloadFileFromExistingBucket(
  bucketName: string,
  key: string,
  filename?: string
): Promise<void> {
  try {
    const downloadResponse = await generateDownloadUrlForExistingBucket(bucketName, key);

    const response = await fetch(downloadResponse.downloadUrl);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename || key.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file from existing bucket:', error);
    throw error;
  }
}

/**
 * Download an entire folder as a zip file from an existing S3 bucket
 */
export async function downloadFolderFromExistingBucket(
  bucketName: string,
  folderPath: string = '',
  folderName?: string
): Promise<void> {
  try {
    console.log('Starting folder download for:', folderPath);

    // List all objects in the folder
    const listResponse = await listObjectsFromExistingBucket(bucketName, folderPath);
    const objects = listResponse.objects;

    if (objects.length === 0) {
      console.log('No files found in folder');
      return;
    }

    // Import JSZip dynamically to avoid bundle size issues
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Download each file and add to zip
    for (const obj of objects) {
      try {
        console.log('Downloading file:', obj.key);

        // Use the S3 proxy to get the file content directly
        const client = generateClient();
        const response = await client.graphql({
          query: `
            query S3ProxyGetFileContent($operation: String!, $bucketName: String!, $key: String!) {
              s3Proxy(operation: $operation, bucketName: $bucketName, key: $key)
            }
          `,
          variables: {
            operation: 'getFileContent',
            bucketName,
            key: obj.key
          }
        });

        const result = JSON.parse((response as any).data.s3Proxy);
        if (!result.success) {
          throw new Error(result.error || 'Failed to download file');
        }

        // Convert base64 content to blob
        const base64Content = result.data.content;
        const contentType = result.data.contentType || 'application/octet-stream';
        const binaryString = atob(base64Content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: contentType });

        // Extract filename from path for cleaner zip structure
        const fileName = obj.key.replace(folderPath, '').replace(/^\/+/, '');
        zip.file(fileName, blob);

        console.log('Added to zip:', fileName);
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

    console.log('Folder download completed');
  } catch (error) {
    console.error('Error downloading folder from existing bucket:', error);
    throw error;
  }
}

/**
 * Helper function to get content type from filename
 */
function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop();
  const contentTypes: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'json': 'application/json',
    'xml': 'application/xml',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed'
  };

  return contentTypes[ext || ''] || 'application/octet-stream';
}
