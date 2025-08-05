import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({ region: 'ap-southeast-2' });

// Supported bucket configurations
const BUCKET_CONFIGS = {
  'airis': {
    name: 'airis-analytica-workspace-sharepoint-data-962000089408',
    region: 'ap-southeast-2'
  },
  'ak': {
    name: 'ak-bkt-exp-1',
    region: 'ap-southeast-2'
  }
};

// Type definitions
interface S3ProxyRequest {
  operation: 'list' | 'upload' | 'download' | 'delete' | 'getSignedUrl' | 'getFileContent';
  bucketName: string;
  key?: string;
  prefix?: string;
  maxKeys?: number;
  continuationToken?: string;
  contentType?: string;
  contentLength?: number;
  expiresIn?: number;
}

interface S3ProxyResponse {
  success: boolean;
  data?: any;
  error?: string;
  continuationToken?: string;
}

interface S3Object {
  key: string;
  size?: number;
  lastModified?: Date;
  eTag?: string;
  contentType?: string;
}

export const handler = async (event: any): Promise<string> => {
  try {
    console.log('S3 Proxy received event:', JSON.stringify(event, null, 2));

    const { operation, bucketName, key, prefix, maxKeys, continuationToken, contentType, contentLength, expiresIn } = event.arguments as S3ProxyRequest;

    // Handle empty strings as undefined for optional parameters
    const cleanKey = key && key.trim() !== '' ? key : undefined;
    const cleanPrefix = prefix && prefix.trim() !== '' ? prefix : undefined;
    const cleanMaxKeys = maxKeys && maxKeys > 0 ? maxKeys : undefined;
    const cleanContinuationToken = continuationToken && continuationToken.trim() !== '' ? continuationToken : undefined;
    const cleanContentType = contentType && contentType.trim() !== '' ? contentType : undefined;
    const cleanContentLength = contentLength && contentLength > 0 ? contentLength : undefined;
    const cleanExpiresIn = expiresIn && expiresIn > 0 ? expiresIn : undefined;

    // Validate bucket name
    const bucketConfig = Object.values(BUCKET_CONFIGS).find(config => config.name === bucketName);
    console.log(`Bucket validation: bucketName=${bucketName}, bucketConfig=`, bucketConfig);
    if (!bucketConfig) {
      throw new Error(`Unsupported bucket: ${bucketName}`);
    }

    let result: S3ProxyResponse;

    switch (operation) {
      case 'list':
        result = await listObjects(bucketName, cleanPrefix || '', cleanMaxKeys || 1000, cleanContinuationToken);
        break;

      case 'upload':
        if (!cleanKey) throw new Error('Key is required for upload operation');
        result = await generateUploadUrl(bucketName, cleanKey, cleanContentType, cleanExpiresIn);
        break;

      case 'download':
        if (!cleanKey) throw new Error('Key is required for download operation');
        result = await generateDownloadUrl(bucketName, cleanKey, cleanExpiresIn);
        break;

      case 'getSignedUrl':
        if (!cleanKey) throw new Error('Key is required for getSignedUrl operation');
        result = await generateSignedUrl(bucketName, cleanKey, cleanExpiresIn);
        break;

      case 'delete':
        if (!cleanKey) throw new Error('Key is required for delete operation');
        result = await deleteObject(bucketName, cleanKey);
        break;

      case 'getFileContent':
        if (!cleanKey) throw new Error('Key is required for getFileContent operation');
        result = await getFileContent(bucketName, cleanKey);
        break;

      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    // Return the result as a JSON string
    return JSON.stringify(result);

  } catch (error) {
    console.error('S3 Proxy error:', error);
    const errorResponse: S3ProxyResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    return JSON.stringify(errorResponse);
  }
};

async function listObjects(bucketName: string, prefix: string, maxKeys: number, continuationToken?: string): Promise<S3ProxyResponse> {
  try {
    console.log(`Listing objects in bucket: ${bucketName}, prefix: "${prefix}", maxKeys: ${maxKeys}`);

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      MaxKeys: maxKeys,
      ContinuationToken: continuationToken
    });

    const response = await s3Client.send(command);

    console.log(`S3 response:`, JSON.stringify(response, null, 2));

    const objects: S3Object[] = (response.Contents || []).map(obj => ({
      key: obj.Key!,
      size: obj.Size,
      lastModified: obj.LastModified,
      eTag: obj.ETag?.replace(/"/g, ''),
      contentType: obj.Key?.includes('.') ? getContentType(obj.Key) : undefined
    }));

    console.log(`Mapped objects:`, JSON.stringify(objects, null, 2));

    return {
      success: true,
      data: {
        objects,
        isTruncated: response.IsTruncated,
        nextContinuationToken: response.NextContinuationToken
      },
      continuationToken: response.NextContinuationToken
    };
  } catch (error) {
    console.error('Error listing objects:', error);
    throw error;
  }
}

async function generateUploadUrl(bucketName: string, key: string, contentType?: string, expiresIn: number = 3600): Promise<S3ProxyResponse> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType || getContentType(key)
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      success: true,
      data: {
        uploadUrl: signedUrl,
        key,
        bucketName
      }
    };
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw error;
  }
}

async function generateDownloadUrl(bucketName: string, key: string, expiresIn: number = 3600): Promise<S3ProxyResponse> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      success: true,
      data: {
        downloadUrl: signedUrl,
        key,
        bucketName
      }
    };
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw error;
  }
}

async function generateSignedUrl(bucketName: string, key: string, expiresIn: number = 3600): Promise<S3ProxyResponse> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      success: true,
      data: {
        signedUrl,
        key,
        bucketName
      }
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}

async function deleteObject(bucketName: string, key: string): Promise<S3ProxyResponse> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    await s3Client.send(command);

    return {
      success: true,
      data: {
        message: 'Object deleted successfully',
        key,
        bucketName
      }
    };
  } catch (error) {
    console.error('Error deleting object:', error);
    throw error;
  }
}

async function getFileContent(bucketName: string, key: string): Promise<S3ProxyResponse> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const response = await s3Client.send(command);
    
    // Convert the stream to base64 for JSON transmission
    const chunks: Uint8Array[] = [];
    const stream = response.Body as any;
    
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    
    const buffer = Buffer.concat(chunks);
    const base64Content = buffer.toString('base64');

    return {
      success: true,
      data: {
        content: base64Content,
        contentType: response.ContentType || 'application/octet-stream',
        key,
        bucketName
      }
    };
  } catch (error) {
    console.error('Error getting file content:', error);
    throw error;
  }
}

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
