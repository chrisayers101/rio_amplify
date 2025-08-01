import { defineFunction } from '@aws-amplify/backend';

export const chatOrchestratorFunction = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'chat-orchestrator',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts',
  // Add environment variables
  environment: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || ''
  }
});
