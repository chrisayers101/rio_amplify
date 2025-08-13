# OpenSearch proxy config

Edit `opensearch.config.ts` in this folder to point to your domain and index.

Example (enterprise)

```ts
export const openSearchConfig = {
  endpoint: 'https://vpc-dnt-genai-aws-pal-openai-fqljqcy4iyrwbss6wppgjwtq3m.ap-southeast-2.es.amazonaws.com',
  domainArn: 'arn:aws:es:ap-southeast-2:962000089409:domain/dnt-genai-aws-pal-openai',
  search: {
    index: 'fs-openai-semantic-chunk-data-automation',
    topK: 5,
    maxTokens: 1000,
    primaryContentField: 'text',
    fallbackContentFields: ['markdown','summary'],
    metadataFields: ['title','section_title','doc_name','chunk_type','chunk_subtype','page_indices'],
    embeddingModelId: 'amazon.titan-embed-text-v2:0',
    answerModelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
  }
}
```

Notes
- For VPC-only domains, run the Lambda in the same VPC/subnets/SGs.
- Set `domainArn` to auto-grant es:ESHttpGet/Post in the backend.
