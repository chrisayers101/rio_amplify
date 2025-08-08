import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

interface ChatRequest {
  message: string
  threadId?: string
  context?: {
    projects?: string[]
    minerals?: string[]
    audience?: string[]
  }
  messages?: unknown[] // Conversation history from Pinia store
}

interface ChatResponse {
  type: 'chunk' | 'error'
  content: string
  threadId: string
}

export class ChatApi {
  private client: any = null;

  private getClient() {
    if (!this.client) {
      try {
        this.client = generateClient<Schema>();
      } catch (error) {
        console.error('Failed to initialize Amplify client:', error)
        throw new Error('Amplify has not been configured. Please call Amplify.configure() before using this service.')
      }
    }
    return this.client;
  }

  async streamChat(
    request: ChatRequest,
    onChunk: (chunk: ChatResponse) => void,
    onError: (error: string) => void,
    onComplete: () => void
  ): Promise<void> {
    try {
      // Use the Data client to invoke the function as a query
      const result = await this.getClient().queries.chatOrchestrator({
        message: request.message,
        threadId: request.threadId || 'default',
        context: JSON.stringify(request.context || {}),
        messages: JSON.stringify(request.messages || [])
      });

      // Check for errors
      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'Unknown error');
      }

      // Parse the response
      console.log('Raw result.data:', result.data);
      console.log('Result data type:', typeof result.data);

      let response;
      try {
        response = JSON.parse(result.data || '{}');
      } catch (parseError) {
        console.error('Failed to parse result.data as JSON:', parseError);
        console.error('Result.data value:', result.data);
        throw new Error(`Invalid JSON response: ${result.data}`);
      }

      if (response.success && response.chunks && Array.isArray(response.chunks)) {
        // Process streaming chunks
        for (const chunk of response.chunks) {
          if (chunk.type === 'chunk' && chunk.content) {
            onChunk(chunk);
          }
        }
      } else if (response.success) {
        // Fallback for non-streaming response
        onChunk({
          type: 'chunk',
          content: response.message || 'Response received',
          threadId: response.threadId || 'default'
        });
      } else {
        onError(response.error || 'Unknown error');
      }

      onComplete()

    } catch (error) {
      onError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  async sendMessage(
    message: string,
    context?: {
      projects?: string[]
      minerals?: string[]
      audience?: string[]
    },
    threadId?: string,
    messages?: unknown[]
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let fullResponse = ''

      this.streamChat(
        {
          message,
          threadId: threadId || 'default',
          context,
          messages
        },
        (chunk) => {
          if (chunk.type === 'chunk') {
            fullResponse += chunk.content
          } else if (chunk.type === 'error') {
            reject(new Error(chunk.content))
          }
        },
        (error) => {
          reject(new Error(error))
        },
        () => {
          resolve(fullResponse)
        }
      )
    })
  }
}

// Export singleton instance
export const chatApi = new ChatApi()
