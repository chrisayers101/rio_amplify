import * as aws4 from 'aws4';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const service = 'es';

// Defaults used only if env vars are not provided by the function resource
const CONFIG = {
    endpoint: 'https://search-amplify-os-dev-ftjbm4vtz7fj6hr3kx3lpifdyu.ap-southeast-2.es.amazonaws.com',
    region: 'ap-southeast-2',
    search: {
		index: 'fs-openai-semantic-chunk-data-automation',
        topK: 5,
        maxTokens: 1000,
        primaryContentField: 'text',
        fallbackContentFields: ['markdown', 'summary'],
        metadataFields: ['title','section_title','doc_name','chunk_type','chunk_subtype','page_indices','doc.application_usage_daily.timestamp','timestamp','application_usage_daily.timestamp'],
        bedrockRegion: 'ap-southeast-2',
        embeddingModelId: 'amazon.titan-embed-text-v2:0',
        answerModelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0'
    }
} as const;

function parseArrayEnv(value?: string, fallback: string[] = []): string[] {
	if (!value) return fallback;
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : fallback;
	} catch {
		return value.split(',').map(s => s.trim()).filter(Boolean);
	}
}

function buildConfigFromEnv() {
	const base = CONFIG as any;
	const endpointFromEnv = process.env.OPENSEARCH_ENDPOINT || (process.env.OPENSEARCH_HOST ? `https://${process.env.OPENSEARCH_HOST}` : undefined);
	const endpoint: string = endpointFromEnv || base.endpoint;
	const regionFromEnv = process.env.OPENSEARCH_REGION;
	const region: string = regionFromEnv || base.region;

	const searchBase = base.search || {};
	const search = {
		index: process.env.SEARCH_INDEX || searchBase.index,
		topK: process.env.SEARCH_TOPK ? Number(process.env.SEARCH_TOPK) : searchBase.topK,
		maxTokens: process.env.SEARCH_MAX_TOKENS ? Number(process.env.SEARCH_MAX_TOKENS) : searchBase.maxTokens,
		primaryContentField: process.env.SEARCH_PRIMARY_FIELD || searchBase.primaryContentField,
		fallbackContentFields: parseArrayEnv(process.env.SEARCH_FALLBACK_FIELDS, searchBase.fallbackContentFields),
		metadataFields: parseArrayEnv(process.env.SEARCH_METADATA_FIELDS, searchBase.metadataFields),
		bedrockRegion: process.env.BEDROCK_REGION || searchBase.bedrockRegion || region,
		embeddingModelId: process.env.BEDROCK_EMBED_MODEL || searchBase.embeddingModelId,
		answerModelId: process.env.BEDROCK_ANSWER_MODEL || searchBase.answerModelId,
	};

	return { endpoint, region, cfg: { ...base, endpoint, region, search } };
}

function loadEndpointFromConfig() {
    const { endpoint, region, cfg } = buildConfigFromEnv();
    if (!endpoint) throw new Error('OpenSearch endpoint not configured in handler');
    if (!region) throw new Error('OpenSearch region not configured in handler');
    return { endpoint, region, cfg };
}

function extractRegionFromEndpoint(endpoint: string): string {
	const host = new URL(endpoint).host;
	const parts = host.split('.');
	const region = parts.find(p => /[a-z]+-\w+-\d+/.test(p));
	return region || process.env.AWS_REGION || 'us-east-1';
}

export const handler = async (event: any) => {
    try {
        const { endpoint, region, cfg } = loadEndpointFromConfig();
        const host = new URL(endpoint).host;
        const args = (event && event.arguments) || {};
        const body = typeof args === 'string' ? JSON.parse(args) : args;
        const op = body.operation || 'rawSearch';

        console.log('[OpenSearchProxy] start', {
            op,
            endpointHost: host,
            region,
            hasQuery: !!body.query,
            hasBody: !!body.body,
            argKeys: Object.keys(body || {})
        });

        if (op === 'rawSearch') {
            const method = (body.method || 'POST').toUpperCase();
            const index = body.index || (cfg.search && cfg.search.index) || '_all';
            const path = body.path || `/${encodeURIComponent(index)}/_search`;
            let reqBody = '';
            if (body.body) {
                reqBody = typeof body.body === 'string' ? body.body : JSON.stringify(body.body);
            } else if (body.query) {
                reqBody = typeof body.query === 'string' ? body.query : JSON.stringify(body.query);
            } else {
                reqBody = JSON.stringify({ query: { match_all: {} } });
            }
            console.log('[OpenSearchProxy] rawSearch', {
                method,
                path,
                index,
                bodyBytes: Buffer.byteLength(reqBody, 'utf8')
            });
            const creds = await defaultProvider()();
            const signed = aws4.sign({
                host,
                method,
                path,
                headers: { 'content-type': 'application/json' },
                body: reqBody,
                service,
                region
            }, {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: (creds as any).sessionToken
            });
            const res = await fetch(`${endpoint}${path}`, { method, headers: signed.headers as any, body: reqBody as any });
            console.log('[OpenSearchProxy] rawSearch response', { status: res.status, ok: res.ok });
            const json = await res.json();
            console.log('[OpenSearchProxy] rawSearch hitsCount', { hits: json?.hits?.hits?.length ?? 0 });
            return JSON.stringify(json);
        }

        if (op === 'ask') {
            const question: string = body.question || '';
            if (!question) return JSON.stringify({ error: 'question required' });

            const searchCfg = cfg.search || {} as any;
            const index = body.index || searchCfg.index;
            const topK = body.topK || searchCfg.topK || 5;
            const primaryField = searchCfg.primaryContentField || 'text';
            const fallbackFields: string[] = searchCfg.fallbackContentFields || ['markdown', 'summary'];
            const metadataFields: string[] = searchCfg.metadataFields || [];
            const bedrockRegion = searchCfg.bedrockRegion || region;
            const embeddingModelId = searchCfg.embeddingModelId;
            const answerModelId = searchCfg.answerModelId;

            if (!embeddingModelId) {
                return JSON.stringify({ error: 'embeddingModelId is not configured. Set it in CONFIG.search.embeddingModelId or env BEDROCK_EMBED_MODEL.' });
            }
            if (body.generateAnswer && !answerModelId) {
                return JSON.stringify({ error: 'answerModelId is not configured. Set it in CONFIG.search.answerModelId or env BEDROCK_ANSWER_MODEL.' });
            }

            console.log('[OpenSearchProxy] ask params', {
                topK,
                index,
                questionLen: question.length,
                embeddingModelId,
                answerModelId,
                bedrockRegion
            });

            // 1) Get embedding
            const bedrock = new BedrockRuntimeClient({ region: bedrockRegion });
            const embedBody = JSON.stringify({ inputText: question });
            const embedCmd = new InvokeModelCommand({
                modelId: embeddingModelId,
                contentType: 'application/json',
                accept: 'application/json',
                body: embedBody
            });
            const embedResp = await bedrock.send(embedCmd);
            const embedText = await embedResp.body!.transformToString();
            const embedJson = JSON.parse(embedText);
            const vector = embedJson.embedding;
            console.log('[OpenSearchProxy] embed ok', { vectorLen: Array.isArray(vector) ? vector.length : 0 });

            // 2) kNN search in OpenSearch
            const searchPath = `/${encodeURIComponent(index)}/_search`;
            const searchBody = {
                size: topK,
                query: { knn: { embedding: { vector, k: topK } } },
                _source: [primaryField, ...fallbackFields, ...metadataFields]
            };
            const reqBody2 = JSON.stringify(searchBody);
            const creds2 = await defaultProvider()();
            const signed2 = aws4.sign({
                host,
                method: 'POST',
                path: searchPath,
                headers: { 'content-type': 'application/json' },
                body: reqBody2,
                service,
                region
            }, {
                accessKeyId: creds2.accessKeyId,
                secretAccessKey: creds2.secretAccessKey,
                sessionToken: (creds2 as any).sessionToken
            });
            const res = await fetch(`${endpoint}${searchPath}`, { method: 'POST', headers: signed2.headers as any, body: reqBody2 as any });
            console.log('[OpenSearchProxy] knn response', { status: res.status, ok: res.ok });
            const json = await res.json();

            const chunks = (json.hits?.hits || []).map((hit: any) => {
                const src = hit._source || {};
                let content = src[primaryField];
                if (!content) {
                    for (const f of fallbackFields) { if (src[f]) { content = src[f]; break; } }
                }
                return {
                    content: content || '',
                    score: hit._score,
                    title: src.title || '',
                    section_title: src.section_title || '',
                    doc_name: src.doc_name || '',
                    chunk_type: src.chunk_type || '',
                    chunk_subtype: src.chunk_subtype || '',
                    page_indices: src.page_indices || []
                };
            });
            console.log('[OpenSearchProxy] knn hits', { count: chunks.length });

            if (!body.generateAnswer) {
                return JSON.stringify({ chunks });
            }

            // 3) Generate answer with Claude
            const context = chunks.map((c: any, i: number) => {
                const header = `Chunk ${i+1}` + (c.doc_name ? ` (from ${c.doc_name})` : '') + (c.section_title ? ` - ${c.section_title}` : '');
                return `${header}:\n${c.content}`;
            }).join('\n\n');
            const prompt = `Based on the following context chunks, please answer the question.\n\nContext:\n${context}\n\nQuestion: ${question}\n\nPlease provide a clear and concise answer based only on the information provided. If the context doesn't contain enough information, please say so.`;
            const answerBody = JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: searchCfg.maxTokens || 1000,
                messages: [{ role: 'user', content: prompt }]
            });
            const answerCmd = new InvokeModelCommand({ modelId: answerModelId!, contentType: 'application/json', accept: 'application/json', body: answerBody });
            const answerResp = await bedrock.send(answerCmd);
            const answerText = await answerResp.body!.transformToString();
            const answerJson = JSON.parse(answerText);
            const answer = answerJson.content?.[0]?.text || '';
            console.log('[OpenSearchProxy] answer generated', { chars: answer.length });
            return JSON.stringify({ answer, chunks });
        }

        return JSON.stringify({ error: 'unsupported operation' });
    } catch (e: any) {
        console.error('[OpenSearchProxy] Error:', e);
        return JSON.stringify({ error: e?.message || 'unknown error' });
    }
};


