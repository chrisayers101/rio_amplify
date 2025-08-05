# S3 Proxy Implementation for Amplify Gen2

This document describes the implementation of an S3 proxy function in AWS Amplify Gen2 to access existing S3 buckets that don't have CORS configuration.

## Overview

The S3 proxy function acts as a secure backend proxy to handle S3 operations for existing buckets, avoiding CORS issues that occur when trying to access S3 buckets directly from the frontend.

## Architecture

### Backend Components

1. **S3 Proxy Function** (`amplify/functions/s3-proxy/`)
   - Lambda function with proper IAM permissions for existing S3 buckets
   - Handles all S3 operations: list, upload, download, delete
   - Generates signed URLs for secure access
   - Supports both existing buckets: `airis-analytica-workspace-sharepoint-data-962000089408` and `ak-bkt-exp-1`

2. **GraphQL Schema Integration** (`amplify/data/resource.ts`)
   - Exposes the S3 proxy function as a GraphQL query
   - Provides type-safe access from the frontend
   - Requires authentication for all operations

### Frontend Components

1. **S3 Proxy Utilities** (`src/utils/s3Proxy.ts`)
   - TypeScript interfaces for all S3 operations
   - Functions to interact with the backend proxy
   - Handles file uploads, downloads, and management

2. **Existing Buckets Integration** (`src/utils/existingBuckets.ts`)
   - Updated to use the S3 proxy instead of throwing errors
   - Maintains the same API for backward compatibility

3. **FilesView Component** (`src/views/FilesView.vue`)
   - Updated to enable existing bucket selection
   - Supports both default Amplify storage and existing S3 buckets
   - Seamless switching between bucket types

## Supported Operations

### List Objects
```typescript
const objects = await listObjectsFromExistingBucket(bucketName, prefix);
```

### Upload Files
```typescript
const result = await uploadFileToExistingBucket(file, bucketName, key);
```

### Download Files
```typescript
await downloadFileFromExistingBucket(bucketName, key, filename);
```

### Generate Signed URLs
```typescript
const signedUrl = await generateSignedUrlForExistingBucket(bucketName, key);
```

### Delete Files
```typescript
await deleteFileFromExistingBucket(key, bucketName);
```

### Download Folders as ZIP
```typescript
await downloadFolderFromExistingBucket(bucketName, folderPath, folderName);
```

## Security Features

1. **IAM Permissions**: Function has specific permissions for the existing S3 buckets
2. **Authentication**: All operations require authenticated users
3. **Signed URLs**: Temporary access URLs with configurable expiration
4. **Input Validation**: Comprehensive validation of all inputs
5. **Error Handling**: Proper error handling and logging

## Configuration

### Supported Buckets
- **Airis Storage**: `airis-analytica-workspace-sharepoint-data-962000089408`
- **AK Experimental**: `ak-bkt-exp-1`

### Region
- All operations use `ap-southeast-2` region

### Timeouts
- Function timeout: 5 minutes (300 seconds)
- Signed URL expiration: 1 hour (3600 seconds) by default

## Usage Examples

### Basic File Operations

```typescript
// List files in a bucket
const files = await listObjectsFromExistingBucket('airis-analytica-workspace-sharepoint-data-962000089408', 'uploads/');

// Upload a file
const file = new File(['content'], 'test.txt', { type: 'text/plain' });
const result = await uploadFileToExistingBucket(file, 'airis-analytica-workspace-sharepoint-data-962000089408');

// Download a file
await downloadFileFromExistingBucket('airis-analytica-workspace-sharepoint-data-962000089408', 'uploads/test.txt');

// Delete a file
await deleteFileFromExistingBucket('uploads/test.txt', 'airis-analytica-workspace-sharepoint-data-962000089408');
```

### Advanced Operations

```typescript
// Generate a signed URL for direct access
const signedUrl = await generateSignedUrlForExistingBucket('airis-analytica-workspace-sharepoint-data-962000089408', 'uploads/document.pdf');

// Download entire folder as ZIP
await downloadFolderFromExistingBucket('airis-analytica-workspace-sharepoint-data-962000089408', 'uploads/', 'my-folder');
```

## Deployment

1. **Install Dependencies**: The function will automatically install AWS SDK dependencies
2. **Deploy Backend**: Run `amplify push` to deploy the function and schema
3. **Update Frontend**: The frontend utilities are ready to use

## Error Handling

The implementation includes comprehensive error handling:

- **Network Errors**: Retry logic and user-friendly error messages
- **Permission Errors**: Clear indication of access issues
- **Validation Errors**: Input validation with helpful error messages
- **S3 Errors**: Proper handling of S3-specific errors

## Performance Considerations

1. **Signed URL Caching**: URLs are generated on-demand to ensure security
2. **Large File Support**: Supports files up to 5GB (Lambda limit)
3. **Batch Operations**: Efficient handling of multiple file operations
4. **Memory Management**: Proper cleanup of temporary resources

## Monitoring and Logging

- **CloudWatch Logs**: All function executions are logged
- **Error Tracking**: Comprehensive error logging for debugging
- **Performance Metrics**: Function duration and memory usage tracking

## Future Enhancements

1. **Multi-part Upload**: Support for very large files
2. **Folder Operations**: Create, rename, and move folders
3. **File Metadata**: Enhanced file information and search
4. **Caching**: Implement caching for frequently accessed files
5. **Compression**: Automatic compression for large files

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure the function has proper IAM permissions
2. **Bucket Not Found**: Verify bucket names and regions
3. **CORS Errors**: The proxy eliminates CORS issues
4. **Timeout Errors**: Large files may require longer timeouts

### Debug Steps

1. Check CloudWatch logs for function errors
2. Verify bucket names and permissions
3. Test with small files first
4. Check authentication status

## Conclusion

This S3 proxy implementation provides a secure, scalable solution for accessing existing S3 buckets without CORS configuration. It maintains the same API as the default Amplify storage while adding support for external buckets. 