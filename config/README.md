# OpenSearch configuration

OpenSearch configuration has been consolidated into `amplify/functions/opensearch-proxy/handler.ts` under the `CONFIG` constant. There is no separate config file anymore.

- To change the OpenSearch endpoint, region, or search defaults, edit the handler directly.
- Keep infrastructure/networking settings managed via your AWS environment or IaC; do not add config files here.
