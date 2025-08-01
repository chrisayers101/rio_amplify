import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { chatOrchestratorFunction } from '../functions/chat-orchestrator/resource';

const schema = a.schema({
  defaultDynamoTable: a
    .model({
      // Add your table fields here
      name: a.string(),
      data: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),

  // Add chat function as a query
  chatOrchestrator: a
    .query()
    .arguments({
      message: a.string(),
      threadId: a.string(),
      context: a.string(), // JSON string
      messages: a.string(), // JSON string
    })
    .returns(a.string())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(chatOrchestratorFunction)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
