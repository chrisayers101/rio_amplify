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

export const airisStorage = defineStorage({
  name: 'airis-analytica-workspace-sharepoint-data-962000089409',
  access: (allow) => ({
    'uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
    'private/*': [
      allow.authenticated.to(['read', 'write', 'delete'])
    ],
  })
});
