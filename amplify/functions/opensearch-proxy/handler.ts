import * as aws4 from 'aws4';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Import types from the shared types file
import { OpenSearchProxyParams, OpenSearchAskParams, SearchConfig } from '../../../shared/opensearch';

const service = 'es';


function buildConfigFromEnv(): { endpoint: string | undefined; region: string | undefined } {
	console.log('[OpenSearchProxy] Environment variables:');
	console.log('[OpenSearchProxy] OPENSEARCH_ENDPOINT:', process.env.OPENSEARCH_ENDPOINT);
	console.log('[OpenSearchProxy] OPENSEARCH_REGION:', process.env.OPENSEARCH_REGION);
	console.log('[OpenSearchProxy] AWS_REGION:', process.env.AWS_REGION);
	console.log('[OpenSearchProxy] All env vars:', Object.keys(process.env).filter(key => key.includes('OPENSEARCH') || key.includes('AWS')));

	const endpoint = process.env.OPENSEARCH_ENDPOINT;
	const region = process.env.OPENSEARCH_REGION;

	return { endpoint, region };
}

/**
 * Validates and extracts search configuration from the request body
 */
function extractSearchConfig(body: any): SearchConfig | { error: string } {
	// Get individual config parameters from body
	const index = body.index;
	const maxTokens = body.maxTokens;
	const primaryContentField = body.primaryContentField;
	const fallbackContentFields = body.fallbackContentFields?.split(',') || [];
	const metadataFields = body.metadataFields?.split(',') || [];
	const bedrockRegion = body.bedrockRegion;
	const embeddingModelId = body.embeddingModelId;
	const answerModelId = body.answerModelId;

	console.log('[OpenSearchProxy] Config parameters loaded:', {
		index, maxTokens, primaryContentField, fallbackContentFields, metadataFields,
		bedrockRegion, embeddingModelId, answerModelId
	});

	// Validate required fields
	if (!index) {
		return { error: 'index is required' };
	}
	if (!embeddingModelId) {
		return { error: 'embeddingModelId is required' };
	}
	if (!answerModelId) {
		return { error: 'answerModelId is required' };
	}
	if (!primaryContentField) {
		return { error: 'primaryContentField is required' };
	}
	if (!bedrockRegion) {
		return { error: 'bedrockRegion is required' };
	}

	return {
		index,
		topK: body.topK || 10, // Default to 10 for ask operation
		maxTokens: maxTokens || 1500,
		primaryContentField,
		fallbackContentFields,
		metadataFields,
		bedrockRegion,
		embeddingModelId,
		answerModelId
	};
}

export const handler = async (event: any): Promise<string> => {
    try {
        console.log('[OpenSearchProxy] ===== FUNCTION START =====');
        console.log('[OpenSearchProxy] Node.js version:', process.version);
        console.log('[OpenSearchProxy] Function name:', process.env.AWS_LAMBDA_FUNCTION_NAME);
        console.log('[OpenSearchProxy] Function version:', process.env.AWS_LAMBDA_FUNCTION_VERSION);

        // Immediate response to test if function is being invoked
        if (event && event.test === true) {
            console.log('[OpenSearchProxy] Test event received, returning test response');
            return JSON.stringify({ message: 'Function is working!', timestamp: new Date().toISOString() });
        }

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
        const body: any = typeof args === 'string' ? JSON.parse(args) : args;
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
            const searchConfig = body.searchConfig;
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
            try {
                console.log('[OpenSearchProxy] Starting ask operation');

                const question: string = body.question;
                if (!question) {
                    console.log('[OpenSearchProxy] Missing question');
                    return JSON.stringify({ error: 'question required' });
                }

                // Extract and validate search configuration
                const searchConfigResult = extractSearchConfig(body);
                if ('error' in searchConfigResult) {
                    return JSON.stringify({ error: searchConfigResult.error });
                }
                const searchCfg = searchConfigResult;

                console.log('[OpenSearchProxy] All required fields validated, proceeding with ask operation');
                console.log('[OpenSearchProxy] Extracted config values:', {
                    index: searchCfg.index,
                    topK: searchCfg.topK,
                    primaryField: searchCfg.primaryContentField,
                    fallbackFields: searchCfg.fallbackContentFields,
                    metadataFields: searchCfg.metadataFields,
                    bedrockRegion: searchCfg.bedrockRegion,
                    embeddingModelId: searchCfg.embeddingModelId,
                    answerModelId: searchCfg.answerModelId
                });

                if (body.generateAnswer && !searchCfg.answerModelId) {
                    return JSON.stringify({ error: 'answerModelId is not configured in searchConfig.' });
                }

                console.log('[OpenSearchProxy] ask params', {
                    topK: searchCfg.topK,
                    index: searchCfg.index,
                    questionLen: question.length,
                    embeddingModelId: searchCfg.embeddingModelId,
                    answerModelId: searchCfg.answerModelId,
                    bedrockRegion: searchCfg.bedrockRegion
                });

                // 1) Get embedding
                console.log('[OpenSearchProxy] ===== STARTING EMBEDDING GENERATION =====');
                console.log('[OpenSearchProxy] Getting embedding with model:', searchCfg.embeddingModelId);
                console.log('[OpenSearchProxy] Bedrock region:', searchCfg.bedrockRegion);
                console.log('[OpenSearchProxy] Question length:', question.length);

                const bedrock = new BedrockRuntimeClient({ region: searchCfg.bedrockRegion });
                const embedBody = JSON.stringify({ inputText: question });
                console.log('[OpenSearchProxy] Embed request body:', embedBody);

                const embedCmd = new InvokeModelCommand({
                    modelId: searchCfg.embeddingModelId,
                    contentType: 'application/json',
                    accept: 'application/json',
                    body: embedBody
                });
                console.log('[OpenSearchProxy] Embed command created, sending to Bedrock...');

                let vector: number[];
                try {
                    console.log('[OpenSearchProxy] Calling Bedrock for embedding...');
                    const embedResp = await bedrock.send(embedCmd);
                    console.log('[OpenSearchProxy] Bedrock response received, processing...');

                    const embedText = await embedResp.body!.transformToString();
                    console.log('[OpenSearchProxy] Embed response text length:', embedText.length);

                    const embedJson = JSON.parse(embedText);
                    console.log('[OpenSearchProxy] Embed response parsed, extracting vector...');

                    vector = embedJson.embedding;
                    console.log('[OpenSearchProxy] Vector extracted, length:', Array.isArray(vector) ? vector.length : 'not an array');
                    console.log('[OpenSearchProxy] ===== EMBEDDING GENERATION COMPLETE =====');
                } catch (embedError: any) {
                    console.error('[OpenSearchProxy] Embedding generation failed:', embedError);
                    console.error('[OpenSearchProxy] Error details:', {
                        name: embedError.name,
                        message: embedError.message,
                        stack: embedError.stack
                    });
                    return JSON.stringify({ error: `Embedding generation failed: ${embedError.message}` });
                }

                // 2) kNN search in OpenSearch
                console.log('[OpenSearchProxy] ===== STARTING OPENSEARCH SEARCH =====');
                console.log('[OpenSearchProxy] Search path:', `/${encodeURIComponent(searchCfg.index)}/_search`);
                console.log('[OpenSearchProxy] Search parameters:', { topK: searchCfg.topK, primaryField: searchCfg.primaryContentField, fallbackFields: searchCfg.fallbackContentFields.length, metadataFields: searchCfg.metadataFields.length });

                const searchPath = `/${encodeURIComponent(searchCfg.index)}/_search`;
                const searchBody = {
                    size: searchCfg.topK,
                    query: { knn: { embedding: { vector, k: searchCfg.topK } } },
                    _source: [searchCfg.primaryContentField, ...searchCfg.fallbackContentFields, ...searchCfg.metadataFields]
                };
                console.log('[OpenSearchProxy] Search body:', JSON.stringify(searchBody, null, 2));

                const reqBody2 = JSON.stringify(searchBody);
                console.log('[OpenSearchProxy] Request body size:', reqBody2.length);

                console.log('[OpenSearchProxy] Signing request...');
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
                console.log('[OpenSearchProxy] Request signed successfully');

                // Debug: Log authentication details
                console.log('[OpenSearchProxy] auth debug', {
                    accessKeyId: creds.accessKeyId?.substring(0, 8) + '...',
                    region,
                    host,
                    signedHeaders: signed2.headers,
                    hasSessionToken: !!(creds as any).sessionToken
                });

                console.log('[OpenSearchProxy] Searching OpenSearch at:', `${endpoint}${searchPath}`);
                console.log('[OpenSearchProxy] Making fetch request...');

                const res = await fetch(`${endpoint}${searchPath}`, { method: 'POST', headers: signed2.headers as any, body: reqBody2 as any });
                console.log('[OpenSearchProxy] Fetch completed, response status:', res.status, 'ok:', res.ok);

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

                        console.log('[OpenSearchProxy] Parsing OpenSearch response...');
                const json = await res.json();
                console.log('[OpenSearchProxy] Response parsed, checking for hits...');

                if (!json.hits?.hits) {
                    console.log('[OpenSearchProxy] No hits found in OpenSearch response');
                    console.log('[OpenSearchProxy] Response structure:', JSON.stringify(json, null, 2));
                    return JSON.stringify({ error: 'No search results found' });
                }

                console.log('[OpenSearchProxy] Processing hits, count:', json.hits.hits.length);
                const chunks = json.hits.hits.map((hit: any, index: number) => {
                    console.log(`[OpenSearchProxy] Processing hit ${index + 1}:`, { score: hit._score, hasSource: !!hit._source });

                    const src = hit._source || {};
                    let content = src[searchCfg.primaryContentField];
                    if (!content) {
                        console.log(`[OpenSearchProxy] Hit ${index + 1} missing primary field '${searchCfg.primaryContentField}', trying fallbacks...`);
                        for (const f of searchCfg.fallbackContentFields) {
                            if (src[f]) {
                                content = src[f];
                                console.log(`[OpenSearchProxy] Hit ${index + 1} using fallback field '${f}'`);
                                break;
                            }
                        }
                    }

                    const chunk = {
                        content: content || '',
                        score: hit._score,
                        title: src.title || '',
                        section_title: src.section_title || '',
                        doc_name: src.doc_name || '',
                        chunk_type: src.chunk_type || '',
                        chunk_subtype: src.chunk_subtype || '',
                        page_indices: src.page_indices || []
                    };

                    console.log(`[OpenSearchProxy] Hit ${index + 1} processed, content length:`, chunk.content.length);
                    return chunk;
                });

                console.log('[OpenSearchProxy] ===== OPENSEARCH SEARCH COMPLETE =====');
                console.log('[OpenSearchProxy] Total chunks processed:', chunks.length);

                if (!body.generateAnswer) {
                    return JSON.stringify({ chunks });
                }

                        // 3) Generate answer with Claude
                console.log('[OpenSearchProxy] ===== STARTING ANSWER GENERATION =====');
                console.log('[OpenSearchProxy] Generating answer with model:', searchCfg.answerModelId);
                console.log('[OpenSearchProxy] Context chunks available:', chunks.length);

                const context = chunks.map((c: any, i: number) => {
                    const header = `Chunk ${i+1}` + (c.doc_name ? ` (from ${c.doc_name})` : '') + (c.section_title ? ` - ${c.section_title}` : '');
                    return `${header}:\n${c.content}`;
                }).join('\n\n');

                console.log('[OpenSearchProxy] Context built, length:', context.length);
                const prompt = `Based on the following context chunks, please answer the question.\n\nContext:\n${context}\n\nQuestion: ${question}\n\nPlease provide a clear and concise answer based only on the information provided. If the context doesn't contain enough information, please say so.`;
                console.log('[OpenSearchProxy] Prompt created, length:', prompt.length);

                const answerBody = JSON.stringify({
                    anthropic_version: 'bedrock-2023-05-31',
                    max_tokens: searchCfg.maxTokens,
                    messages: [{ role: 'user', content: prompt }]
                });
                console.log('[OpenSearchProxy] Answer request body created, size:', answerBody.length);

                const answerCmd = new InvokeModelCommand({ modelId: searchCfg.answerModelId!, contentType: 'application/json', accept: 'application/json', body: answerBody });
                console.log('[OpenSearchProxy] Answer command created, calling Bedrock...');

                try {
                    console.log('[OpenSearchProxy] Calling Bedrock for answer generation...');
                    const answerResp = await bedrock.send(answerCmd);
                    console.log('[OpenSearchProxy] Bedrock answer response received, processing...');

                    const answerText = await answerResp.body!.transformToString();
                    console.log('[OpenSearchProxy] Answer response text length:', answerText.length);

                    const answerJson = JSON.parse(answerText);
                    console.log('[OpenSearchProxy] Answer response parsed, extracting text...');

                    const answer = answerJson.content?.[0]?.text;
                    console.log('[OpenSearchProxy] Answer extracted, length:', answer?.length || 0);

                    console.log('[OpenSearchProxy] ===== ANSWER GENERATION COMPLETE =====');
                    console.log('[OpenSearchProxy] Returning final response with answer and chunks');
                    return JSON.stringify({ answer, chunks });
                } catch (answerError: any) {
                    console.error('[OpenSearchProxy] Answer generation failed:', answerError);
                    console.error('[OpenSearchProxy] Error details:', {
                        name: answerError.name,
                        message: answerError.message,
                        stack: answerError.stack
                    });
                    return JSON.stringify({ error: `Answer generation failed: ${answerError.message}` });
                }
            } catch (error) {
                console.error('[OpenSearchProxy] CRASH in ask operation:', error);
                console.error('[OpenSearchProxy] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
                return JSON.stringify({
                    error: 'Internal error in ask operation',
                    details: error instanceof Error ? error.message : String(error),
                    operation: 'ask'
                });
            }
        }

        console.log('[OpenSearchProxy] Unsupported operation:', op);
        return JSON.stringify({ error: 'unsupported operation' });
    } catch (error) {
        console.error('[OpenSearchProxy] CRASH in main handler:', error);
        console.error('[OpenSearchProxy] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        return JSON.stringify({
            error: 'Internal error in OpenSearch proxy function',
            details: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        });
    } finally {
        console.log('[OpenSearchProxy] ===== FUNCTION END =====');
    }
};


