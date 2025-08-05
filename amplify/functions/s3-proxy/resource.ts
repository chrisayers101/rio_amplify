import { defineFunction } from '@aws-amplify/backend';

export const s3ProxyFunction = defineFunction({
  name: 's3-proxy',
  entry: './handler.ts',
  timeoutSeconds: 300, // 5 minutes
});
