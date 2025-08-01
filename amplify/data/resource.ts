import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  defaultDynamoTable: a
    .model({
      // Add your table fields here
      name: a.string(),
      data: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
