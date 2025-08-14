import { defineFunction } from '@aws-amplify/backend';

export const openSearchProxyFunction = defineFunction({
	name: 'opensearch-proxy',
	entry: './handler.ts',
	timeoutSeconds: 120,
});



