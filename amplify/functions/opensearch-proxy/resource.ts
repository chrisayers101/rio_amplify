import { defineFunction } from '@aws-amplify/backend';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { readFileSync } from 'fs';
import { join } from 'path';
import { openSearchConfig } from './opensearch.config';

// Load config at synth time and pass to the Lambda as env vars
const cfg = openSearchConfig as any;
let env: Record<string, string> = {};
try {
	let endpoint: string | undefined = cfg.endpoint;
	let region: string | undefined = cfg.region;
	let search = cfg.search || {};
	if (!endpoint && cfg.domains) {
		const key = cfg.default || 'dev';
		endpoint = cfg.domains[key]?.endpoint;
		region = cfg.domains[key]?.region;
	}
	if (endpoint) env.OS_ENDPOINT = endpoint;
	if (region) env.OS_REGION = region;
	if (search.index) env.OS_INDEX = String(search.index);
	if (search.embeddingModelId) env.OS_EMBEDDING_MODEL_ID = String(search.embeddingModelId);
	if (search.answerModelId) env.OS_ANSWER_MODEL_ID = String(search.answerModelId);
	if (search.topK != null) env.OS_TOP_K = String(search.topK);
} catch {}

export const openSearchProxyFunction = defineFunction({
	name: 'opensearch-proxy',
	entry: './handler.ts',
	timeoutSeconds: 120,
	environment: env,
});



