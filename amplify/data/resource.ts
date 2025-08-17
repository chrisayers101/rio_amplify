import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { chatOrchestratorFunction } from '../functions/chat-orchestrator/resource';
import { s3ProxyFunction } from '../functions/s3-proxy/resource';
import { openSearchProxyFunction } from '../functions/opensearch-proxy/resource';

const schema = a.schema({
  FeasibilityStudySections: a
    .model({
      projectId: a.string().required(),   // PK
      sectionId: a.string().required(),   // SK
      sectionName: a.string(),            // Section display name
      percentComplete: a.integer(),       // you'll filter/sort on this
      status: a.enum(['not_started', 'in_progress', 'complete']), // maybe a GSI on this later
      qualityRating: a.string(),          // Quality assessment rating
      entity: a.json(),                   // the rest (nested content, issues…)
      createdAt: a.datetime(),            // automatically managed timestamp
      updatedAt: a.datetime(),            // automatically managed timestamp
    })
    .identifier(['projectId','sectionId'])
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

  // Add S3 proxy function as a query
  s3Proxy: a
    .query()
    .arguments({
      operation: a.string(),
      bucketName: a.string(),
      key: a.string(),
      prefix: a.string(),
      maxKeys: a.integer(),
      continuationToken: a.string(),
      contentType: a.string(),
      contentLength: a.integer(),
      expiresIn: a.integer(),
    })
    .returns(a.string())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(s3ProxyFunction)),

  // Add OpenSearch proxy function as a query
  openSearchProxy: a
    .query()
    .arguments({
      operation: a.string().required(), // 'rawSearch' | 'ask'
      index: a.string(),
      question: a.string(),
      generateAnswer: a.boolean(),
      method: a.string(),
      path: a.string(),
      query: a.json(),
      body: a.json(),
      topK: a.integer(),
      searchConfig: a.json(), // Search configuration object to override defaults
    })
    .returns(a.string())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(openSearchProxyFunction)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
