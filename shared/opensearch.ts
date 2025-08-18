/**
 * OpenSearch proxy operation parameters (flat structure for GraphQL compatibility)
 */
export interface OpenSearchProxyParams {
  operation: 'ask' | 'test' | 'rawSearch';
  question?: string;
  generateAnswer?: boolean;
  topK?: number;
  // Search configuration parameters (required for 'ask' operation)
  index?: string;
  maxTokens?: number;
  primaryContentField?: string;
  fallbackContentFields?: string; // Comma-separated string
  metadataFields?: string; // Comma-separated string
  bedrockRegion?: string;
  embeddingModelId?: string;
  answerModelId?: string;
  // Additional fields for 'rawSearch' operation
  method?: string;
  path?: string;
  query?: any;
  body?: any;
  searchConfig?: any;
}
