import * as aws4 from 'aws4';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const service = 'es';



// Required search configuration - must be provided by caller
interface SearchConfig {
    index: string;
    topK: number;
    maxTokens: number;
    primaryContentField: string;
    fallbackContentFields: string[];
    metadataFields: string[];
    bedrockRegion: string;
    embeddingModelId: string;
    answerModelId: string;
}

function buildConfigFromEnv() {
	console.log('[OpenSearchProxy] Environment variables:');
	console.log('[OpenSearchProxy] OPENSEARCH_ENDPOINT:', process.env.OPENSEARCH_ENDPOINT);
	console.log('[OpenSearchProxy] OPENSEARCH_REGION:', process.env.OPENSEARCH_REGION);
	console.log('[OpenSearchProxy] AWS_REGION:', process.env.AWS_REGION);
	console.log('[OpenSearchProxy] All env vars:', Object.keys(process.env).filter(key => key.includes('OPENSEARCH') || key.includes('AWS')));

	const endpoint = process.env.OPENSEARCH_ENDPOINT;
	const region = process.env.OPENSEARCH_REGION;

	return { endpoint, region };
}

export const handler = async (event: any) => {
    console.log('[OpenSearchProxy] ===== FUNCTION START =====');
    console.log('[OpenSearchProxy] Node.js version:', process.version);
    console.log('[OpenSearchProxy] Function name:', process.env.AWS_LAMBDA_FUNCTION_NAME);
    console.log('[OpenSearchProxy] Function version:', process.env.AWS_LAMBDA_FUNCTION_VERSION);

    // Immediate response to test if function is being invoked
    if (event && event.test === true) {
        console.log('[OpenSearchProxy] Test event received, returning test response');
        return JSON.stringify({ message: 'Function is working!', timestamp: new Date().toISOString() });
    }

    try {
        console.log('[OpenSearchProxy] Starting handler with event:', JSON.stringify(event, null, 2));

        const { endpoint, region } = buildConfigFromEnv();
        console.log('[OpenSearchProxy] Config loaded:', { endpoint, region });

        if (!endpoint) {
            console.error('[OpenSearchProxy] Missing OPENSEARCH_ENDPOINT environment variable');
            return JSON.stringify({ error: 'OpenSearch endpoint not configured in handler' });
        }
        if (!region) {
            console.error('[OpenSearchProxy] Missing OPENSEARCH_REGION environment variable');
            return JSON.stringify({ error: 'OpenSearch region not configured in handler' });
        }

                const host = new URL(endpoint).host;
        const args = (event && event.arguments);
        const body = typeof args === 'string' ? JSON.parse(args) : args;
        const op = body.operation;

        console.log('[OpenSearchProxy] Operation:', op, 'Body:', JSON.stringify(body, null, 2));

        // Ensure we have a valid operation
        if (!op) {
            console.error('[OpenSearchProxy] Missing operation parameter');
            return JSON.stringify({ error: 'operation parameter is required' });
        }

        // Handle test operation
        if (op === 'test') {
            console.log('[OpenSearchProxy] Test operation received');
            return JSON.stringify({
                message: 'OpenSearch proxy function is working!',
                timestamp: new Date().toISOString(),
                config: { endpoint, region }
            });
        }

        // Get credentials once at the top
        const creds = await defaultProvider()();

        console.log('[OpenSearchProxy] start', {
            op,
            endpointHost: host,
            region,
            hasQuery: !!body.query,
            hasBody: !!body.body,
            argKeys: Object.keys(body)
        });

        if (op === 'rawSearch') {
            const method = body.method.toUpperCase();
            const searchConfig = body.searchConfig as SearchConfig;
            if (!searchConfig) {
                return JSON.stringify({ error: 'searchConfig is required for rawSearch operation' });
            }
            const index = body.index;
            const path = body.path;
            let reqBody = '';
            if (body.body) {
                reqBody = typeof body.body === 'string' ? body.body : JSON.stringify(body.body);
            } else if (body.query) {
                reqBody = typeof body.query === 'string' ? body.query : JSON.stringify(body.query);
            }
            console.log('[OpenSearchProxy] rawSearch', {
                method,
                path,
                index,
                bodyBytes: Buffer.byteLength(reqBody, 'utf8')
            });
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

            // Debug: Log authentication details for rawSearch
            console.log('[OpenSearchProxy] rawSearch auth debug', {
                accessKeyId: creds.accessKeyId?.substring(0, 8) + '...',
                region,
                host,
                signedHeaders: signed.headers,
                hasSessionToken: !!(creds as any).sessionToken
            });

            const res = await fetch(`${endpoint}${path}`, { method, headers: signed.headers as any, body: reqBody as any });
            console.log('[OpenSearchProxy] rawSearch response', { status: res.status, ok: res.ok });

            // Debug: Log response details if it fails
            if (!res.ok) {
                const errorText = await res.text();
                console.log('[OpenSearchProxy] rawSearch error details', {
                    status: res.status,
                    statusText: res.statusText,
                    headers: Object.fromEntries(res.headers.entries()),
                    errorBody: errorText.substring(0, 500)
                });
            }

            const json = await res.json();
            console.log('[OpenSearchProxy] rawSearch hitsCount', { hits: json?.hits?.hits?.length });
            return JSON.stringify(json);
        }

                if (op === 'ask') {
            console.log('[OpenSearchProxy] Starting ask operation');

            const question: string = body.question;
            if (!question) {
                console.log('[OpenSearchProxy] Missing question');
                return JSON.stringify({ error: 'question required' });
            }

                        // Get search config from request body
            console.log('[OpenSearchProxy] Raw searchConfig from body:', body.searchConfig);
            console.log('[OpenSearchProxy] Type of searchConfig:', typeof body.searchConfig);

            const searchConfig = body.searchConfig as SearchConfig;
            if (!searchConfig) {
                console.log('[OpenSearchProxy] Missing searchConfig');
                return JSON.stringify({ error: 'searchConfig is required for ask operation' });
            }

            console.log('[OpenSearchProxy] Search config validated:', JSON.stringify(searchConfig, null, 2));

            // Log the search config validation
            console.log('[OpenSearchProxy] Validating search config fields...');
            console.log('[OpenSearchProxy] - index:', searchConfig.index, 'type:', typeof searchConfig.index);
            console.log('[OpenSearchProxy] - topK:', searchConfig.topK, 'type:', typeof searchConfig.topK);
            console.log('[OpenSearchProxy] - maxTokens:', searchConfig.maxTokens, 'type:', typeof searchConfig.maxTokens);
            console.log('[OpenSearchProxy] - primaryContentField:', searchConfig.primaryContentField, 'type:', typeof searchConfig.primaryContentField);
            console.log('[OpenSearchProxy] - fallbackContentFields:', searchConfig.fallbackContentFields, 'type:', typeof searchConfig.fallbackContentFields);
            console.log('[OpenSearchProxy] - metadataFields:', searchConfig.metadataFields, 'type:', typeof searchConfig.metadataFields);
            console.log('[OpenSearchProxy] - bedrockRegion:', searchConfig.bedrockRegion, 'type:', typeof searchConfig.bedrockRegion);
            console.log('[OpenSearchProxy] - embeddingModelId:', searchConfig.embeddingModelId, 'type:', typeof searchConfig.embeddingModelId);
            console.log('[OpenSearchProxy] - answerModelId:', searchConfig.answerModelId, 'type:', typeof searchConfig.answerModelId);

            // Validate all required fields are present
            const requiredFields = ['index', 'topK', 'maxTokens', 'primaryContentField', 'fallbackContentFields', 'metadataFields', 'bedrockRegion', 'embeddingModelId', 'answerModelId'];
            const missingFields = requiredFields.filter(field => !searchConfig[field as keyof SearchConfig]);

            if (missingFields.length > 0) {
                console.log('[OpenSearchProxy] Missing required fields:', missingFields);
                return JSON.stringify({ error: `Missing required search config fields: ${missingFields.join(', ')}` });
            }

            console.log('[OpenSearchProxy] All required fields present, proceeding with ask operation');
            const searchCfg = searchConfig;

            const index = searchCfg.index;
            const topK = searchCfg.topK;
            const primaryField = searchCfg.primaryContentField;
            const fallbackFields: string[] = searchCfg.fallbackContentFields;
            const metadataFields: string[] = searchCfg.metadataFields;
            const bedrockRegion = searchCfg.bedrockRegion;
            const embeddingModelId = searchCfg.embeddingModelId;
            const answerModelId = searchCfg.answerModelId;

            if (!embeddingModelId) {
                return JSON.stringify({ error: 'embeddingModelId is not configured in searchConfig parameter.' });
            }
            if (body.generateAnswer && !answerModelId) {
                return JSON.stringify({ error: 'answerModelId is not configured in searchConfig parameter.' });
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
            console.log('[OpenSearchProxy] Getting embedding with model:', embeddingModelId);
            const bedrock = new BedrockRuntimeClient({ region: bedrockRegion });
            const embedBody = JSON.stringify({ inputText: question });
            const embedCmd = new InvokeModelCommand({
                modelId: embeddingModelId,
                contentType: 'application/json',
                accept: 'application/json',
                body: embedBody
            });

            let vector: number[];
            try {
                const embedResp = await bedrock.send(embedCmd);
                const embedText = await embedResp.body!.transformToString();
                const embedJson = JSON.parse(embedText);
                vector = embedJson.embedding;
                console.log('[OpenSearchProxy] embed ok', { vectorLen: Array.isArray(vector) ? vector.length : 0 });
            } catch (embedError: any) {
                console.error('[OpenSearchProxy] Embedding generation failed:', embedError);
                return JSON.stringify({ error: `Embedding generation failed: ${embedError.message}` });
            }

            // 2) kNN search in OpenSearch
            const searchPath = `/${encodeURIComponent(index)}/_search`;
            const searchBody = {
                size: topK,
                query: { knn: { embedding: { vector, k: topK } } },
                _source: [primaryField, ...fallbackFields, ...metadataFields]
            };
            const reqBody2 = JSON.stringify(searchBody);
            const signed2 = aws4.sign({
                host,
                method: 'POST',
                path: searchPath,
                headers: { 'content-type': 'application/json' },
                body: reqBody2,
                service,
                region
            }, {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: (creds as any).sessionToken
            });

            // Debug: Log authentication details
            console.log('[OpenSearchProxy] auth debug', {
                accessKeyId: creds.accessKeyId?.substring(0, 8) + '...',
                region,
                host,
                signedHeaders: signed2.headers,
                hasSessionToken: !!(creds as any).sessionToken
            });

            console.log('[OpenSearchProxy] Searching OpenSearch at:', `${endpoint}${searchPath}`);
            const res = await fetch(`${endpoint}${searchPath}`, { method: 'POST', headers: signed2.headers as any, body: reqBody2 as any });
            console.log('[OpenSearchProxy] knn response', { status: res.status, ok: res.ok });

            // Debug: Log response details if it fails
            if (!res.ok) {
                const errorText = await res.text();
                console.log('[OpenSearchProxy] knn error details', {
                    status: res.status,
                    statusText: res.statusText,
                    headers: Object.fromEntries(res.headers.entries()),
                    errorBody: errorText.substring(0, 500) // First 500 chars
                });
                return JSON.stringify({ error: `OpenSearch search failed: ${res.status} ${res.statusText}` });
            }

            const json = await res.json();

            if (!json.hits?.hits) {
                console.log('[OpenSearchProxy] No hits found in OpenSearch response');
                return JSON.stringify({ error: 'No search results found' });
            }

            const chunks = json.hits.hits.map((hit: any) => {
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
            console.log('[OpenSearchProxy] Generating answer with model:', answerModelId);
            const context = chunks.map((c: any, i: number) => {
                const header = `Chunk ${i+1}` + (c.doc_name ? ` (from ${c.doc_name})` : '') + (c.section_title ? ` - ${c.section_title}` : '');
                return `${header}:\n${c.content}`;
            }).join('\n\n');
            const prompt = `Based on the following context chunks, please answer the question.\n\nContext:\n${context}\n\nQuestion: ${question}\n\nPlease provide a clear and concise answer based only on the information provided. If the context doesn't contain enough information, please say so.`;
            const answerBody = JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: searchCfg.maxTokens,
                messages: [{ role: 'user', content: prompt }]
            });
            const answerCmd = new InvokeModelCommand({ modelId: answerModelId!, contentType: 'application/json', accept: 'application/json', body: answerBody });

            try {
                const answerResp = await bedrock.send(answerCmd);
                const answerText = await answerResp.body!.transformToString();
                const answerJson = JSON.parse(answerText);
                const answer = answerJson.content?.[0]?.text;
                console.log('[OpenSearchProxy] answer generated', { chars: answer.length });
                return JSON.stringify({ answer, chunks });
            } catch (answerError: any) {
                console.error('[OpenSearchProxy] Answer generation failed:', answerError);
                return JSON.stringify({ error: `Answer generation failed: ${answerError.message}` });
            }
        }

        console.log('[OpenSearchProxy] Unsupported operation:', op);
        return JSON.stringify({ error: 'unsupported operation' });
    } catch (e: any) {
        console.error('[OpenSearchProxy] Error:', e);
        return JSON.stringify({ error: e?.message });
    } finally {
        console.log('[OpenSearchProxy] ===== FUNCTION END =====');
    }
};


