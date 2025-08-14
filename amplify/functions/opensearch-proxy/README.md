# OpenSearch proxy configuration

Configuration now lives exclusively in `handler.ts` under the constant `CONFIG`.

- Edit `amplify/functions/opensearch-proxy/handler.ts` to set the OpenSearch `endpoint`, `region`, and search defaults.
- Do not maintain separate config files; they have been removed to reduce duplication.

Notes
- For VPC-only domains, ensure the Lambda runs with network access to the domain (same VPC/subnets/SGs as needed) and that the domain access policy allows the Lambda role.
