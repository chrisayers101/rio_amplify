import { defineFunction } from '@aws-amplify/backend';

export const chatOrchestratorFunction = defineFunction({
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts',
  timeoutSeconds: 900 // 15 minutes
});
