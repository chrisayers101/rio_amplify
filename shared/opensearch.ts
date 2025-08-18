/**
 * OpenSearch proxy operation parameters (flat structure for GraphQL compatibility)
 */
export interface OpenSearchProxyParams {
  operation: 'ask';
  question: string;
  generateAnswer: boolean;
  topK?: number;
  // Search configuration parameters
  index: string;
  maxTokens: number;
  primaryContentField: string;
  fallbackContentFields: string; // Comma-separated string
  metadataFields: string; // Comma-separated string
  bedrockRegion: string;
  embeddingModelId: string;
  answerModelId: string;
}
