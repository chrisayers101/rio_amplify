// ============================================================================
// S3 PROXY INTERFACES
// ============================================================================

import type { S3Object } from './s3.types'

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
