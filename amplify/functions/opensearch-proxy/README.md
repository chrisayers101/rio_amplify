# OpenSearch proxy configuration

Configuration now lives exclusively in `handler.ts` under the constant `CONFIG`.

- Edit `amplify/functions/opensearch-proxy/handler.ts` to set the OpenSearch `endpoint`, `region`, and search defaults.
- Do not maintain separate config files; they have been removed to reduce duplication.

## Configuration for dnt-genai-aws-pal-openai domain

To use this function with the `dnt-genai-aws-pal-openai` domain, make these specific changes:

### 1. Update handler.ts CONFIG constant
```typescript
const CONFIG = {
    endpoint: 'https://vpc-dnt-genai-aws-pal-openai-fqljqcy4iyrwbss6wppgjwtq3m.ap-southeast-2.es.amazonaws.com',
    region: 'ap-southeast-2',
    // ... rest of config
} as const;
```

### 2. Update resource.ts for VPC access
```typescript
import { defineFunction } from '@aws-amplify/backend';

export const openSearchProxyFunction = defineFunction({
    name: 'opensearch-proxy',
    entry: './handler.ts',
    timeoutSeconds: 120,
    vpc: {
        vpcId: 'vpc-0f822ddd65fef83bd',
        subnetIds: [
            'subnet-05f88037dc10c0873', // ap-southeast-2b
            'subnet-0ab4716cb11409b4f', // ap-southeast-2a
            'subnet-0de74d4e1afdea070'  // ap-southeast-2c
        ],
        securityGroupIds: [
            'sg-00d72a863a170cba3',
            'sg-088193fe6037fc397',
            'sg-0cf9f1bad389498de',
            'sg-0f2ccf02dd1e279dc'
        ]
    }
});
```

### 3. Alternative: Use environment variables
You can also override the endpoint via environment variables in your Amplify backend configuration:
```typescript
// In your backend.ts or equivalent
OPENSEARCH_ENDPOINT: 'https://vpc-dnt-genai-aws-pal-openai-fqljqcy4iyrwbss6wppgjwtq3m.ap-southeast-2.es.amazonaws.com'
```

Notes
- For VPC-only domains, ensure the Lambda runs with network access to the domain (same VPC/subnets/SGs as needed) and that the domain access policy allows the Lambda role.
- The `dnt-genai-aws-pal-openai` domain is VPC-only, so VPC configuration is required for the Lambda function to reach it.
