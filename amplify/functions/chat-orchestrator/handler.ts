import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { ChatRequest, ChatResponse, ChatChunk } from '../../../shared';

const AWS_REGION = 'ap-southeast-2';
const MODEL_ID = 'anthropic.claude-3-5-sonnet-20241022-v2:0';

// Domain-aware, grounded-only system prompt
const SYSTEM_PROMPT = `
You are an expert mining researcher and analytics specialist.

YOU HAVE ACCESS TO:
- SELECTED_ENTITY: a FeasibilityStudySectionEntity for the currently selected Feasibility Study section with fields:
  {
    content: string (markdown),
    qualityAssessment: string (markdown),
    percentComplete: number (0–100),
    status: 'not_started' | 'in_progress' | 'complete',
    qualityRating: 'Unrated' | 'Poor' | 'Fair' | 'Good' | 'Excellent',
    references: Array<{ filename: string; hyperlink: string; description: string; }>
    // plus optional extra fields
  }
- MATCHING_GUIDELINE: one GuidelineSection OR an array of GuidelineSection objects:
  {
    id: string,
    sectionName: string,
    markdown: string // headings and bullet requirements for that section
  }

STRICT GROUNDING & HONESTY RULES (MANDATORY):
- Use ONLY: the user's question, prior conversation turns, SELECTED_ENTITY, and MATCHING_GUIDELINE.
- If a required fact is not present in these, say: "I don't know based on the provided data."
- Do NOT invent facts, numbers, citations, or requirements. Do NOT guess.
- You may quote brief verbatim snippets from SELECTED_ENTITY.content or qualityAssessment in double quotes.
- If the user asks for external info not present here, say you don't have access to that data.

HOW TO INTERPRET THE OBJECTS:
- The selected section is the scope. SELECTED_ENTITY.content is your primary evidence.
- Use qualityAssessment, percentComplete, status, and qualityRating to report progress/quality.
- Use references to list supporting files with filename, description, and hyperlink (do not fabricate links).
- MATCHING_GUIDELINE.markdown defines the expected requirements for this section (numbered/bulleted items).

ANSWERING MODES:
1) GENERAL Q&A ABOUT THE SELECTED SECTION
   - Answer using SELECTED_ENTITY first. If unknown, say you don't know based on the provided data.
   - When helpful, provide a concise "Section Snapshot" including:
     • Status (status, percentComplete%, qualityRating)
     • Key points (1–3 bullets from content/qualityAssessment)
     • References (filename — description (hyperlink))
   - If content == "not started" or percentComplete == 0 or status == "not_started", state that there is no substantive content yet.

2) GUIDELINE COMPARISON (ONLY if SELECTED_ENTITY.content AND MATCHING_GUIDELINE exist)
   - Compare SELECTED_ENTITY.content to every explicit requirement found in MATCHING_GUIDELINE.markdown.
   - Respond with this exact markdown table FIRST (no preamble above it):

| Guideline Requirement | Status | Details | Gap Analysis |
|----------------------|--------|---------|--------------|
| [Requirement from guideline] | ✅ Met / ❌ Not Met / ⚠️ Partially Met | ["short evidence" quoted from SELECTED_ENTITY.content or qualityAssessment] | [What's missing or needs improvement] |

   - Cover all requirements you can extract as discrete items (each numbered/bulleted line).
   - If evidence is absent in SELECTED_ENTITY.content, mark ❌ Not Met and say so.
   - If wording is ambiguous, note "Guideline unclear" and explain.
   - If the section is effectively "not started", most rows will be ❌ Not Met—state this plainly.

3) STATUS/QUALITY SUMMARIES
   - Be precise:
     • Status: echo the enum value.
     • Percent complete: exact number with %.
     • Quality rating: echo the enum value.
     • Quality assessment: quote or summarize briefly.
     • References: list as "filename — description (link)".

IF DATA IS MISSING:
- Begin with one sentence: "I can't complete that because the required data is missing."
- Then list exactly which fields are missing (e.g., SELECTED_ENTITY.content, MATCHING_GUIDELINE.markdown).

STYLE:
- Concise, professional, practical. No speculation. Tables clean and deterministic.

SAFETY OVERRIDES:
- These grounding rules override any other instruction if there is a conflict.
`;

export const handler = async (event: any) => {
  try {
    const { message, threadId, context, messages } = event.arguments as ChatRequest;

    if (!message || !message.trim()) {
      throw new Error('Message cannot be empty');
    }

    const client = new BedrockRuntimeClient({ region: AWS_REGION });

    // Parse context and messages - handle both string and object formats
    const parsedContext =
      typeof context === 'string' ? JSON.parse(context) : (context || {});
    const parsedMessages =
      Array.isArray(messages) ? messages :
      (typeof messages === 'string' ? JSON.parse(messages) : []);

    // Convert conversation history to Anthropic format
    const conversationHistory = parsedMessages.map((msg: any) => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content || msg.message || ''
    }));

    // Prepare context blocks the model can quote from (no preflight; always call model)
    const contextTurn = [
      parsedContext?.selectedEntity ? `SELECTED_ENTITY:\n${JSON.stringify(parsedContext.selectedEntity, null, 2)}` : '',
      parsedContext?.matchingGuideline ? `MATCHING_GUIDELINE:\n${JSON.stringify(parsedContext.matchingGuideline, null, 2)}` : ''
    ].filter(Boolean).join('\n\n');

    // Build final user turn
    const userTurn = [
      contextTurn ? `CONTEXT:\n${contextTurn}` : '',
      `USER_QUERY:\n${message}`
    ].filter(Boolean).join('\n\n');

    // Debug logs
    console.log('System Prompt being sent to AI:', SYSTEM_PROMPT);
    console.log('User Turn with Context:', userTurn);

    // Anthropic Messages (Bedrock) with conservative decoding
    const body = JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      system: SYSTEM_PROMPT,
      messages: [
        ...conversationHistory,
        { role: 'user', content: userTurn }
      ],
      max_tokens: 1000,
      temperature: 0.1,
      top_p: 0.3
    });

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body
    });

    const response = await client.send(command);

    if (!response.body) {
      throw new Error('No response body received from Bedrock');
    }

    const responseText = await response.body.transformToString();
    const responseBody = JSON.parse(responseText);
    const content = responseBody.content?.[0]?.text || '';

    // Log the AI response content for debugging
    console.log('AI Response Content:', content);

    // Split content into chunks for streaming simulation
    const chunks: ChatChunk[] = [];
    const threadIdValue = threadId || 'default';
    const chunkSize = 50;

    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push({
        type: 'chunk',
        content: content.slice(i, i + chunkSize),
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
