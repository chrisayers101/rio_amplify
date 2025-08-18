import * as aws4 from 'aws4';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Import types from the shared types file
import { OpenSearchProxyParams } from '../../../shared/opensearch';

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
 * Validates required fields for ask operation
 */
function validateAskParams(body: OpenSearchProxyParams): { error: string } | null {
	if (body.operation !== 'ask') return null;
	if (!body.index) return { error: 'index is required for ask operation' };
	if (!body.embeddingModelId) return { error: 'embeddingModelId is required for ask operation' };
	if (!body.answerModelId) return { error: 'answerModelId is required for ask operation' };
	if (!body.primaryContentField) return { error: 'primaryContentField is required for ask operation' };
	if (!body.bedrockRegion) return { error: 'bedrockRegion is required for ask operation' };
	return null;
}

export const handler = async (event: { arguments?: OpenSearchProxyParams; test?: boolean }): Promise<string> => {
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
        const body: OpenSearchProxyParams = typeof args === 'string' ? JSON.parse(args) : args;
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

        console.log('[OpenSearchProxy] Starting operation:', { op, endpointHost: host, region });

        if (op === 'rawSearch') {
            if (!body.method) return JSON.stringify({ error: 'method is required for rawSearch operation' });
            if (!body.path) return JSON.stringify({ error: 'path is required for rawSearch operation' });

            const method = body.method.toUpperCase();
            const searchConfig = body.searchConfig;
            if (!searchConfig) {
                return JSON.stringify({ error: 'searchConfig is required for rawSearch operation' });
            }
            let reqBody = '';
            if (body.body) {
                reqBody = typeof body.body === 'string' ? body.body : JSON.stringify(body.body);
            } else if (body.query) {
                reqBody = typeof body.query === 'string' ? body.query : JSON.stringify(body.query);
            }
            console.log('[OpenSearchProxy] rawSearch', {
                method,
                path: body.path,
                bodyBytes: Buffer.byteLength(reqBody, 'utf8')
            });
            const signed = aws4.sign({
                host,
                method,
                path: body.path!,
                headers: { 'content-type': 'application/json' },
                body: reqBody,
                service,
                region
            }, {
                accessKeyId: creds.accessKeyId,
                secretAccessKey: creds.secretAccessKey,
                sessionToken: (creds as any).sessionToken
            });



            const res = await fetch(`${endpoint}${body.path!}`, { method, headers: signed.headers as any, body: reqBody as any });
            console.log('[OpenSearchProxy] rawSearch response', { status: res.status, ok: res.ok });

            if (!res.ok) {
                const errorText = await res.text();
                console.log('[OpenSearchProxy] rawSearch error:', res.status, res.statusText);
            }

            const json = await res.json();
            console.log('[OpenSearchProxy] rawSearch hitsCount', { hits: json?.hits?.hits?.length });
            return JSON.stringify(json);
        }

        if (op === 'ask') {
            try {
                console.log('[OpenSearchProxy] Starting ask operation');

                if (!body.question) {
                    console.log('[OpenSearchProxy] Missing question');
                    return JSON.stringify({ error: 'question required' });
                }
                const question: string = body.question;

                // Validate required fields
                const validationError = validateAskParams(body);
                if (validationError) {
                    return JSON.stringify(validationError);
                }

                console.log('[OpenSearchProxy] All required fields validated, proceeding with ask operation');

                if (body.generateAnswer && !body.answerModelId) {
                    return JSON.stringify({ error: 'answerModelId is required when generateAnswer is true' });
                }

                console.log('[OpenSearchProxy] ask params', {
                    topK: body.topK || 10,
                    questionLen: question.length,
                    embeddingModelId: body.embeddingModelId,
                    answerModelId: body.answerModelId
                });

                // 1) Get embedding
                console.log('[OpenSearchProxy] ===== STARTING EMBEDDING GENERATION =====');
                console.log('[OpenSearchProxy] Getting embedding with model:', body.embeddingModelId);
                console.log('[OpenSearchProxy] Bedrock region:', body.bedrockRegion);
                console.log('[OpenSearchProxy] Question length:', question.length);

                const bedrock = new BedrockRuntimeClient({ region: body.bedrockRegion });
                const embedBody = JSON.stringify({ inputText: question });
                console.log('[OpenSearchProxy] Embed request body:', embedBody);

                const embedCmd = new InvokeModelCommand({
                    modelId: body.embeddingModelId,
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
                console.log('[OpenSearchProxy] Search path:', `/${encodeURIComponent(body.index!)}/_search`);
                console.log('[OpenSearchProxy] Search parameters:', { topK: body.topK || 10, primaryField: body.primaryContentField });

                const searchPath = `/${encodeURIComponent(body.index!)}/_search`;
                const searchBody = {
                    size: body.topK || 10,
                    query: { knn: { embedding: { vector, k: body.topK || 10 } } },
                    _source: [body.primaryContentField, ...(body.fallbackContentFields?.split(',') || []), ...(body.metadataFields?.split(',') || [])]
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



                console.log('[OpenSearchProxy] Searching OpenSearch at:', `${endpoint}${searchPath}`);
                console.log('[OpenSearchProxy] Making fetch request...');

                const res = await fetch(`${endpoint}${searchPath}`, { method: 'POST', headers: signed2.headers as any, body: reqBody2 as any });
                console.log('[OpenSearchProxy] Fetch completed, response status:', res.status, 'ok:', res.ok);

                if (!res.ok) {
                    const errorText = await res.text();
                    console.log('[OpenSearchProxy] knn error:', res.status, res.statusText);
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
                    const src = hit._source || {};
                    let content = src[body.primaryContentField!];
                    if (!content) {
                        for (const f of (body.fallbackContentFields?.split(',') || [])) {
                            if (src[f]) {
                                content = src[f];
                                break;
                            }
                        }
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

                console.log('[OpenSearchProxy] ===== OPENSEARCH SEARCH COMPLETE =====');
                console.log('[OpenSearchProxy] Total chunks processed:', chunks.length);

                if (!body.generateAnswer) {
                    return JSON.stringify({ chunks });
                }

                        // 3) Generate answer with Claude
                console.log('[OpenSearchProxy] ===== STARTING ANSWER GENERATION =====');
                console.log('[OpenSearchProxy] Generating answer with model:', body.answerModelId);
                console.log('[OpenSearchProxy] Context chunks available:', chunks.length);

                const context = chunks.map((c: any, i: number) => {
                    const header = `Chunk ${i+1}` + (c.doc_name ? ` (from ${c.doc_name})` : '') + (c.section_title ? ` - ${c.section_title}` : '');
                    return `${header}:\n${c.content}`;
                }).join('\n\n');

                const prompt = `Based on the following context chunks, please answer the question.\n\nContext:\n${context}\n\nQuestion: ${question}\n\nPlease provide a clear and concise answer based only on the information provided. If the context doesn't contain enough information, please say so.`;

                const answerBody = JSON.stringify({
                    anthropic_version: 'bedrock-2023-05-31',
                    max_tokens: body.maxTokens,
                    messages: [{ role: 'user', content: prompt }]
                });

                const answerCmd = new InvokeModelCommand({ modelId: body.answerModelId!, contentType: 'application/json', accept: 'application/json', body: answerBody });

                try {
                    console.log('[OpenSearchProxy] Calling Bedrock for answer generation...');
                    const answerResp = await bedrock.send(answerCmd);
                    console.log('[OpenSearchProxy] Bedrock answer response received, processing...');

                    const answerText = await answerResp.body!.transformToString();
                    const answerJson = JSON.parse(answerText);
                    const answer = answerJson.content?.[0]?.text;

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


