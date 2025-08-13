# OpenSearch configuration

Use a single file `config/opensearch.json`. Replace values below for your enterprise environment.

Exact JSON example (enterprise)

```json
{
  "_notes": [
    "Single-file config for OpenSearch proxy.",
    "Edit these values for your environment and deploy (amplify push).",
    "If the domain is VPC-only, infra.* must be set and the Lambda attached to that VPC."
  ],
  "endpoint": "https://vpc-dnt-genai-aws-pal-openai-fqljqcy4iyrwbss6wppgjwtq3m.ap-southeast-2.es.amazonaws.com",
  "domainArn": "arn:aws:es:ap-southeast-2:962000089409:domain/dnt-genai-aws-pal-openai",
  "search": {
    "index": "fs-openai-semantic-chunk-data-automation",
    "topK": 5,
    "maxTokens": 1000,
    "primaryContentField": "text",
    "fallbackContentFields": ["markdown", "summary"],
    "metadataFields": [
      "title",
      "section_title",
      "doc_name",
      "chunk_type",
      "chunk_subtype",
      "page_indices"
    ],
    "embeddingModelId": "amazon.titan-embed-text-v2:0",
    "answerModelId": "anthropic.claude-3-5-sonnet-20241022-v2:0"
  },
  "infra": {
    "vpcId": "vpc-0f822ddd65fef83bd",
    "subnetIds": [
      "subnet-05f88037dc10c0873",
      "subnet-0ab4716cb11409b4f",
      "subnet-0de74d4e1afdea070"
    ],
    "lambdaSecurityGroupId": "sg-REPLACE_ME",
    "domainSecurityGroupIds": [
      "sg-00d72a863a170cba3",
      "sg-088193fe6037fc397",
      "sg-0cf9f1bad389498de",
      "sg-0f2ccf02dd1e279dc"
    ]
  }
}
```

Notes
- endpoint: VPC endpoint for your OpenSearch domain
- domainArn: enables automatic es:ESHttpGet/Post grant to the Lambda
- infra.vpcId/subnetIds: three private subnets in the same VPC as the domain
- infra.lambdaSecurityGroupId: security group attached to the Lambda; must allow egress TCP 443
- Domain SGs must allow inbound TCP 443 from the Lambda SG
- The Lambda role ARN is output as `OpenSearchProxyLambdaRoleArn` after deploy; include it in the domain access policy if required
- Region is inferred from the endpoint; no need to set it here
