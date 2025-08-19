// ============================================================================
// S3 INTERFACES
// ============================================================================

export interface S3Object {
  key: string
  size?: number
  lastModified?: Date
  eTag?: string
}
