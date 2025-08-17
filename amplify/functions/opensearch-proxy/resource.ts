import { defineFunction } from '@aws-amplify/backend';

export const openSearchProxyFunction = defineFunction({
	name: 'opensearch-proxy',
	entry: './handler.ts',
	timeoutSeconds: 120,
	environment: {
		OPENSEARCH_ENDPOINT: 'https://search-amplify-os-dev-ftjbm4vtz7fj6hr3kx3lpifdyu.ap-southeast-2.es.amazonaws.com',
		OPENSEARCH_REGION: 'ap-southeast-2'
	}
});



