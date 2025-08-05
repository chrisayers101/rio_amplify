import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'defaultBucket',
  access: (allow) => ({
    'uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    'private/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
  })
});
