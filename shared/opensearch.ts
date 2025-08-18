/**
 * Search configuration for OpenSearch proxy operations
 * Must match the interface defined in the Lambda function
 */
export interface SearchConfig {
  /** OpenSearch index name */
  index: string;
  /** Number of top results to return */
  topK: number;
  /** Maximum tokens for answer generation */
  maxTokens: number;
  /** Primary content field to extract from search results */
  primaryContentField: string;
  /** Fallback content fields if primary field is missing */
  fallbackContentFields: string[];
  /** Metadata fields to include in search results */
  metadataFields: string[];
  /** AWS region for Bedrock services */
  bedrockRegion: string;
  /** Bedrock model ID for generating embeddings */
  embeddingModelId: string;
  /** Bedrock model ID for generating answers */
  answerModelId: string;
}

/**
 * Parameters for OpenSearch proxy ask operation
 */
export interface OpenSearchAskParams {
  operation: 'ask';
  question: string;
  generateAnswer: boolean;
  topK?: number;
  searchConfig: SearchConfig;
}

/**
 * Frontend interface for OpenSearch proxy operations (flat structure for GraphQL compatibility)
 */
export interface OpenSearchProxyFlatParams {
  operation: 'ask';
  question: string;
  generateAnswer: boolean;
  topK?: number;
  // Individual config parameters for GraphQL compatibility
  index: string;
  maxTokens: number;
  primaryContentField: string;
  fallbackContentFields: string; // Comma-separated string
  metadataFields: string; // Comma-separated string
  bedrockRegion: string;
  embeddingModelId: string;
  answerModelId: string;
}

/**
 * Union type for all OpenSearch proxy operations
 */
export type OpenSearchProxyParams = OpenSearchAskParams;
