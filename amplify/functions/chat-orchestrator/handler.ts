import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

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

const AWS_REGION = "ap-southeast-2";
const MODEL_ID = "anthropic.claude-3-5-sonnet-20241022-v2:0";

export const handler = async (event: any) => {
  try {
    const { message, threadId, context, messages } = event.arguments as ChatRequest;

    if (!message || !message.trim()) {
      throw new Error('Message cannot be empty');
    }

    const client = new BedrockRuntimeClient({ region: AWS_REGION });

    // Parse context and messages
    const parsedContext = context ? JSON.parse(context) : {};
    const parsedMessages = messages ? JSON.parse(messages) : [];

    // Convert conversation history to Claude format
    const conversationHistory = parsedMessages.map((msg: any) => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content || msg.message || ''
    }));

    // Add context information if available - now using selected entity and guideline
    let contextInfo = '';
    if (parsedContext.selectedEntity && parsedContext.matchingGuideline) {
      contextInfo += `\n\nIMPORTANT CONTEXT - SELECTED ENTITY AND GUIDELINE:\n`;
      contextInfo += `Selected Entity: ${JSON.stringify(parsedContext.selectedEntity, null, 2)}\n`;
      contextInfo += `Matching Guideline: ${JSON.stringify(parsedContext.matchingGuideline, null, 2)}`;
    }

    // Create enhanced message with system prompt and context
    const systemPrompt = `You are an expert mining researcher and analytics specialist with deep knowledge of the mining industry, mineral exploration, and data analysis. Your expertise includes mining operations, geological analysis, financial analysis, environmental impact assessment, market analysis, technical analysis, and regulatory compliance. Provide detailed, accurate, and practical insights based on your mining and analytics expertise.

IMPORTANT: When the user asks to compare against guidelines or assess compliance, use the provided guideline JSON data as a reference standard to compare against the entity.content property. The guidelines contain the expected structure and requirements for each section. Analyze how well the entity content aligns with the guideline requirements and provide specific feedback on gaps, strengths, and areas for improvement.`;

    const enhancedMessage = `${systemPrompt}\n\n${contextInfo ? `${contextInfo}\n\n` : ''}User Query: ${message}`;

    // Log the system prompt for debugging
    console.log('System Prompt being sent to AI:', systemPrompt);
    console.log('Enhanced Message with Context:', enhancedMessage);

    conversationHistory.push({
      role: 'user',
      content: enhancedMessage
    });

    const body = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1000,
      messages: conversationHistory
    });

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body
    });

    const response = await client.send(command);

    if (!response.body) {
      throw new Error('No response body received from Bedrock');
    }

    const responseText = await response.body.transformToString();
    const responseBody = JSON.parse(responseText);
    const content = responseBody.content?.[0]?.text || '';

    // Split content into chunks for streaming simulation
    const chunks: ChatChunk[] = [];
    const threadIdValue = threadId || 'default';
    const chunkSize = 50;

    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      chunks.push({
        type: 'chunk',
        content: chunk,
        threadId: threadIdValue
      });
    }

    const responseData: ChatResponse = {
      chunks,
      success: true
    };

    return JSON.stringify(responseData);

  } catch (error) {
    console.error('Error in chat orchestrator:', error);

    const errorResponse: ChatResponse = {
      chunks: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return JSON.stringify(errorResponse);
  }
};
