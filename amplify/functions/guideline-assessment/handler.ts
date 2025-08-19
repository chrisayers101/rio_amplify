import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { FeasibilityStudySectionStatus } from '../../../shared';

const AWS_REGION = "ap-southeast-2";
const MODEL_ID = "anthropic.claude-3-5-sonnet-20241022-v2:0";

interface GuidelineAssessmentRequest {
  content: string;
  guideline: string;
  sectionName?: string;
  projectId: string;
  sectionId: string;
}

interface GuidelineAssessmentResponse {
  projectId: string;
  sectionId: string;
  qualityAssessment: string;  // Markdown string - now required
}

export const handler = async (event: any) => {


  try {
        const { content, guideline, sectionName, projectId, sectionId } = event.arguments as GuidelineAssessmentRequest;
    console.log('🔍 [GuidelineAssessment] Parsed arguments:', {
      hasContent: !!content,
      contentLength: content?.length || 0,
      hasGuideline: !!guideline,
      guidelineLength: guideline?.length || 0,
      sectionName: sectionName || 'Not provided',
      projectId: projectId || 'Not provided',
      sectionId: sectionId || 'Not provided'
    });

    if (!content || !guideline) {
      console.error('❌ [GuidelineAssessment] Missing required arguments');
      throw new Error('Content and guideline are required');
    }

    console.log('🌐 [GuidelineAssessment] Creating Bedrock client for region:', AWS_REGION);
    const client = new BedrockRuntimeClient({ region: AWS_REGION });
    console.log('✅ [GuidelineAssessment] Bedrock client created successfully');

    // Create the assessment prompt
    console.log('📝 [GuidelineAssessment] Creating system prompt...');
    const systemPrompt = `You are an expert mining researcher and analytics specialist. Your task is to assess the quality and completeness of feasibility study content against provided guidelines.

**REQUIRED ASSESSMENT FORMAT:**
You must return a JSON object with exactly this property:

{
  "qualityAssessment": "Markdown string with detailed analysis"
}

**Assessment Instructions:**
1. Analyze the content against the guideline requirements
2. Provide detailed quality assessment in markdown format
3. Focus on mining industry standards and feasibility study requirements
4. Include strengths, gaps, and recommendations in your assessment

**Content to Assess:** ${content}

**Guideline Requirements:** ${guideline}

**Section Name:** ${sectionName || 'Unknown'}

Return ONLY the JSON object, no additional text.`;

    console.log('💬 [GuidelineAssessment] Creating conversation history...');
    const conversationHistory = [
      {
        role: 'user',
        content: systemPrompt
      }
    ];
    console.log('✅ [GuidelineAssessment] Conversation history created with', conversationHistory.length, 'messages');

    console.log('📤 [GuidelineAssessment] Preparing Bedrock API call...');
    const body = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1500,
      messages: conversationHistory
    });
    console.log('📋 [GuidelineAssessment] Request body prepared, length:', body.length);

    console.log('🤖 [GuidelineAssessment] Creating InvokeModelCommand for model:', MODEL_ID);
    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body
    });
    console.log('✅ [GuidelineAssessment] Command created, sending to Bedrock...');

    console.log('⏳ [GuidelineAssessment] Waiting for Bedrock response...');
    const response = await client.send(command);
    console.log('✅ [GuidelineAssessment] Bedrock response received');

    if (!response.body) {
      console.error('❌ [GuidelineAssessment] No response body received from Bedrock');
      throw new Error('No response body received from Bedrock');
    }

    console.log('📖 [GuidelineAssessment] Transforming response body...');
    const responseText = await response.body.transformToString();
    console.log('📄 [GuidelineAssessment] Response text length:', responseText.length);

    console.log('🔍 [GuidelineAssessment] Parsing response JSON...');
    const responseBody = JSON.parse(responseText);
    console.log('✅ [GuidelineAssessment] Response JSON parsed successfully');

    const aiResponse = responseBody.content?.[0]?.text || '';
    console.log('🤖 [GuidelineAssessment] AI response extracted, length:', aiResponse.length);

        // Extract the assessment markdown from the AI response
    console.log('🔍 [GuidelineAssessment] Extracting assessment markdown from AI response...');

    // Look for markdown content starting with # or ##
    const markdownMatch = aiResponse.match(/(#.*?)(?=\n\n|$)/s);
    let assessmentMarkdown = aiResponse;

    if (markdownMatch) {
      assessmentMarkdown = markdownMatch[0];
      console.log('✅ [GuidelineAssessment] Markdown pattern found, length:', assessmentMarkdown.length);
    } else {
      console.log('⚠️ [GuidelineAssessment] No markdown pattern found, using full response');
    }

    // Create the response object
    const assessmentResponse: GuidelineAssessmentResponse = {
      projectId,
      sectionId,
      qualityAssessment: assessmentMarkdown
    };

    // Console log what we're returning
    console.log('📤 [GuidelineAssessment] Returning response object:');
    console.log('📄 [GuidelineAssessment] Response:', JSON.stringify(assessmentResponse, null, 2));
    console.log('📄 [GuidelineAssessment] Assessment length:', assessmentMarkdown.length);
    console.log('📄 [GuidelineAssessment] Assessment preview:', assessmentMarkdown.substring(0, 200) + '...');

    return JSON.stringify(assessmentResponse);

  } catch (error) {
    console.error('💥 [GuidelineAssessment] Error in guideline assessment:', error);

    const errorResponse: GuidelineAssessmentResponse = {
      projectId: event.arguments?.projectId || 'unknown',
      sectionId: event.arguments?.sectionId || 'unknown',
      qualityAssessment: `# Assessment Error

An error occurred during the guideline assessment: ${error instanceof Error ? error.message : 'Unknown error'}

Please try again or contact support if the issue persists.`
    };

    // Console log the error result
    console.log('📤 [GuidelineAssessment] Returning error response:');
    console.log('📄 [GuidelineAssessment] Error response:', JSON.stringify(errorResponse, null, 2));

    return JSON.stringify(errorResponse);
  }
};
