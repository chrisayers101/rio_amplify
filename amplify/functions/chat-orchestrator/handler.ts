import { OpenAI } from 'openai';

interface ChatRequest {
  message: string;
  threadId?: string;
  context?: string;
  messages?: string;
}

interface ChatChunk {
  type: 'chunk';
  content: string;
  threadId: string;
}

interface ChatResponse {
  chunks: ChatChunk[];
  success: boolean;
  error?: string;
}

export const handler = async (event: any) => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const { message, threadId, context, messages } = event.arguments as ChatRequest;

    // Validate required fields
    if (!message || !message.trim()) {
      throw new Error('Message cannot be empty');
    }

    // Check for API key first
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.log('Environment variables:', Object.keys(process.env));
      console.log('OPENAI_API_KEY value:', process.env.OPENAI_API_KEY);
      throw new Error('OPENAI_API_KEY environment variable not set in Lambda function');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Parse context and messages
    const parsedContext = context ? JSON.parse(context) : {};
    const parsedMessages = messages ? JSON.parse(messages) : [];

    // Convert conversation history to OpenAI format
    const conversationHistory = parsedMessages.map((msg: any) => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content || msg.message || ''
    }));

    // Add system prompt for mining researcher and analytics expert
    const systemPrompt = {
      role: 'system',
      content: `You are an expert mining researcher and analytics specialist with deep knowledge of the mining industry, mineral exploration, and data analysis. Your expertise includes:

- Mining operations and processes across different mineral types
- Geological analysis and exploration techniques
- Financial analysis of mining projects and investments
- Environmental impact assessment and sustainability in mining
- Market analysis for minerals and commodities
- Technical analysis of mining data and trends
- Regulatory compliance and best practices in mining

When responding to queries, provide detailed, accurate, and practical insights based on your mining and analytics expertise. Use industry terminology appropriately and offer data-driven recommendations when possible.`
    };

    // Add system prompt at the beginning of conversation history
    conversationHistory.unshift(systemPrompt);

    // Format context information as IMPORTANT section
    let contextInfo = '';
    if (parsedContext.projects && parsedContext.projects.length > 0) {
      contextInfo += `\n\nIMPORTANT CONTEXT - SELECTED PROJECTS:\n${parsedContext.projects.join(', ')}`;
    }
    if (parsedContext.minerals && parsedContext.minerals.length > 0) {
      contextInfo += `\n\nIMPORTANT CONTEXT - SELECTED MINERALS:\n${parsedContext.minerals.join(', ')}`;
    }
    if (parsedContext.audience && parsedContext.audience.length > 0) {
      contextInfo += `\n\nIMPORTANT CONTEXT - TARGET AUDIENCE:\n${parsedContext.audience.join(', ')}`;
    }

    // Add current message with context information
    const enhancedMessage = contextInfo ? `${contextInfo}\n\nUser Query: ${message}` : message;
    conversationHistory.push({
      role: 'user',
      content: enhancedMessage
    });

    // Stream the response
    console.log('Starting OpenAI streaming request...');
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversationHistory,
      temperature: 0.7,
      stream: true,
      max_tokens: 1000, // Limit response length to avoid timeouts
    });

    const chunks: ChatChunk[] = [];
    const threadIdValue = threadId || 'default';
    let chunkCount = 0;

    // Process each chunk
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        chunks.push({
          type: 'chunk',
          content,
          threadId: threadIdValue
        });
        chunkCount++;
      }
    }

    console.log(`Streaming completed. Received ${chunkCount} chunks.`);

    // Return the response
    const response: ChatResponse = {
      chunks,
      success: true
    };

    console.log('Returning response:', JSON.stringify(response, null, 2));
    return response;

  } catch (error) {
    console.error('Error in chat orchestrator:', error);
    
    const errorResponse: ChatResponse = {
      chunks: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return errorResponse;
  }
}; 