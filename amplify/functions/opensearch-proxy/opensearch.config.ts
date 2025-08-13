export interface OpenSearchConfig {
	// Either set top-level endpoint, or use domains + default
	endpoint?: string;
	region?: string;
	domainArn?: string;
	default?: string;
	domains?: Record<string, { endpoint: string; region?: string; domainArn?: string }>;
	search: {
		index: string;
		topK?: number;
		maxTokens?: number;
		primaryContentField?: string;
		fallbackContentFields?: string[];
		metadataFields?: string[];
		bedrockRegion?: string;
		embeddingModelId?: string;
		answerModelId?: string;
	};
}

// Fill these for your environment. For sandbox testing, use a public endpoint.
export const openSearchConfig: OpenSearchConfig = {
	// endpoint: 'https://your-public-os-domain.ap-southeast-2.es.amazonaws.com',
	// domainArn: 'arn:aws:es:ap-southeast-2:123456789012:domain/your-domain',
	default: 'dev',
	domains: {
		dev: {
			endpoint: 'https://search-amplify-os-dev-ftjbm4vtz7fj6hr3kx3lpifdyu.ap-southeast-2.es.amazonaws.com',
			region: 'ap-southeast-2',
			domainArn: 'arn:aws:es:ap-southeast-2:029109261863:domain/amplify-os-dev',
		},
	},
	search: {
		index: 'fs-openai-semantic-chunk-data-automation',
		topK: 5,
		maxTokens: 1000,
		primaryContentField: 'text',
		fallbackContentFields: ['markdown', 'summary'],
		metadataFields: ['title','section_title','doc_name','chunk_type','chunk_subtype','page_indices'],
		bedrockRegion: 'ap-southeast-2',
		embeddingModelId: 'amazon.titan-embed-text-v2:0',
		answerModelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
	},
};


