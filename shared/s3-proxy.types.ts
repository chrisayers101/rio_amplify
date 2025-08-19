// ============================================================================
// S3 PROXY INTERFACES
// ============================================================================

import type { S3Object } from './s3.types'

export interface S3ProxyRequest {
  operation: 'list' | 'upload' | 'download' | 'delete' | 'getSignedUrl' | 'getFileContent'
  bucketName: string
  key?: string
  prefix?: string
  maxKeys?: number
  continuationToken?: string
  contentType?: string
  contentLength?: number
  expiresIn?: number
}

export interface S3ProxyResponse {
  success: boolean
  data?: any
  error?: string
  continuationToken?: string
}

export interface S3ProxyListResponse {
  objects: S3Object[]
  isTruncated: boolean
  nextContinuationToken?: string
}

export interface S3ProxyUploadResponse {
  uploadUrl: string
  key: string
  bucketName: string
}

export interface S3ProxyDownloadResponse {
  downloadUrl: string
  key: string
  bucketName: string
}

export interface S3ProxySignedUrlResponse {
  signedUrl: string
  key: string
  bucketName: string
}

export interface S3ProxyDeleteResponse {
  message: string
  key: string
  bucketName: string
}

export interface S3ProxyFileContentResponse {
  content: string
  contentType: string
  key: string
  bucketName: string
}

// Bucket configuration interface
export interface BucketConfig {
  name: string
  region: string
}
