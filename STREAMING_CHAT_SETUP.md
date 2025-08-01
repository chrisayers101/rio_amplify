# Streaming Chat Setup Guide

## Overview
This implementation provides a streaming chat interface using LangGraph, OpenAI, and Vue.js with Pinia state management. All conversation data is stored locally in the Pinia store (no database persistence).

## Files Created/Modified

### Backend (Python)
- `amplify/functions/chat-orchestrator/streaming_chat.py` - Main streaming chat function
- `amplify/functions/chat-orchestrator/requirements.txt` - Python dependencies
- `amplify/functions/chat-orchestrator/resource.ts` - Amplify function configuration

### Frontend (Vue.js)
- `src/stores/chatStore.ts` - Pinia store for chat state management
- `src/components/Conversation.vue` - Enhanced chat component with streaming
- `src/utils/chatApi.ts` - API utility for streaming communication

## Setup Instructions

### 1. Set OpenAI API Key
You need to manually add your OpenAI API key to the environment:

```bash
# Set the environment variable for the Amplify function
export OPENAI_API_KEY="your-openai-api-key-here"
```

### 2. Deploy the Function
```bash
# Deploy the chat-orchestrator function
amplify push
```

### 3. Test the Implementation
The streaming chat should now work with:
- Real-time token streaming
- Message history stored in Pinia
- Context awareness (projects, minerals, audience)
- Error handling and loading states

## Key Features

### ✅ Streaming Support
- Token-by-token streaming from OpenAI
- Real-time UI updates
- Smooth typing animation

### ✅ State Management
- Pinia store for conversation state
- No database persistence (as requested)
- Context preservation across messages

### ✅ UI Features
- Modern chat interface
- Message rating (thumbs up/down)
- Copy message functionality
- Loading and error states
- Auto-scroll to new messages

### ✅ LangGraph Integration
- Simple workflow with chat node
- Extensible for future enhancements
- Error handling and recovery

## Usage Example

```vue
<template>
  <Conversation 
    :selected-projects="['Project A', 'Project B']"
    :selected-minerals="['Iron Ore', 'Copper']"
    :selected-audience="['Investors', 'Stakeholders']"
    @rate-message="handleRateMessage"
  />
</template>

<script setup>
import Conversation from '@/components/Conversation.vue'

const handleRateMessage = ({ messageId, rating }) => {
  console.log(`Message ${messageId} rated as ${rating}`)
}
</script>
```

## Next Steps for Enhancement

1. **Add Tools**: Integrate with Xero and other APIs
2. **Multi-agent**: Add specialized agents for different tasks
3. **Memory**: Add conversation persistence when needed
4. **Moderation**: Add content filtering
5. **Analytics**: Track message ratings and usage

## Troubleshooting

### Common Issues

1. **OpenAI API Key Not Set**
   - Ensure `OPENAI_API_KEY` environment variable is set
   - Check function logs for authentication errors

2. **Streaming Not Working**
   - Verify the function is deployed correctly
   - Check browser console for network errors
   - Ensure CORS headers are properly set

3. **Messages Not Persisting**
   - This is expected behavior - messages are only stored in Pinia
   - Page refresh will clear conversation history

### Debug Commands

```bash
# Check function logs
amplify console function

# Test function locally
cd amplify/functions/chat-orchestrator
python streaming_chat.py
```

## Architecture

```
Frontend (Vue.js + Pinia)
    ↓ HTTP Request
Backend (Python + LangGraph)
    ↓ OpenAI API
OpenAI GPT Model
    ↓ Streaming Response
Frontend (Real-time Updates)
```

The implementation is now complete and ready for use! The chat will stream responses in real-time while maintaining conversation state locally in the Pinia store. 