import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { GuidelineAssessmentResponse } from '../../../shared';

const AWS_REGION = "ap-southeast-2";
const MODEL_ID = "anthropic.claude-3-5-sonnet-20241022-v2:0";

interface GuidelineAssessmentRequest {
  content: string;
  guideline: string;
  sectionName?: string;
  projectId: string;
  sectionId: string;
}

// Exponential backoff function for throttling
async function sendWithRetry(client: BedrockRuntimeClient, command: any, maxRetries: number = 3): Promise<any> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await client.send(command);
    } catch (error: any) {
      if (error.name === 'ThrottlingException' && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`⏳ [GuidelineAssessment] Throttled, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
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

    // Validate and sanitize content to prevent Bedrock API issues
    const sanitizedContent = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    const sanitizedGuideline = guideline.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Truncate very long inputs to prevent API issues
    const MAX_CONTENT_LENGTH = 15000;
    const MAX_GUIDELINE_LENGTH = 8000;

    const truncatedContent = sanitizedContent.length > MAX_CONTENT_LENGTH
      ? sanitizedContent.substring(0, MAX_CONTENT_LENGTH) + '\n\n[Content truncated due to length]'
      : sanitizedContent;

    const truncatedGuideline = sanitizedGuideline.length > MAX_GUIDELINE_LENGTH
      ? sanitizedGuideline.substring(0, MAX_GUIDELINE_LENGTH) + '\n\n[Guideline truncated due to length]'
      : sanitizedGuideline;

    console.log('📊 [GuidelineAssessment] Content sanitization:', {
      originalLength: content.length,
      sanitizedLength: sanitizedContent.length,
      truncatedLength: truncatedContent.length,
      wasTruncated: truncatedContent !== sanitizedContent
    });

    console.log('📊 [GuidelineAssessment] Guideline sanitization:', {
      originalLength: guideline.length,
      sanitizedLength: sanitizedGuideline.length,
      truncatedLength: truncatedGuideline.length,
      wasTruncated: truncatedGuideline !== sanitizedGuideline
    });

    console.log('🌐 [GuidelineAssessment] Creating Bedrock client for region:', AWS_REGION);
    const client = new BedrockRuntimeClient({ region: AWS_REGION });
    console.log('✅ [GuidelineAssessment] Bedrock client created successfully');

    // Create the system prompt with JSON-only requirement
    console.log('📝 [GuidelineAssessment] Creating system prompt...');
    const systemPrompt = `You are an expert mining researcher and analytics specialist. Your task is to assess the quality and completeness of feasibility study content against provided guidelines.

**CRITICAL: You must return ONLY valid JSON. No additional text, no markdown formatting outside the JSON structure.**

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
5. Return ONLY the JSON object, no additional text or formatting

**IMPORTANT: If you cannot complete the assessment for any reason, return this JSON instead:**
{
  "qualityAssessment": "# Assessment Error\\n\\nUnable to complete assessment. Please try again or contact support."
}

**Content to Assess:** ${truncatedContent}

**Guideline Requirements:** ${truncatedGuideline}

**Section Name:** ${sectionName || 'Unknown'}

Return ONLY the JSON object with the qualityAssessment property.`;

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
      max_tokens: 2500,
      temperature: 0,
      messages: conversationHistory
    });
    console.log('📋 [GuidelineAssessment] Request body prepared, length:', body.length);
    console.log('📄 [GuidelineAssessment] Content preview (first 200 chars):', truncatedContent.substring(0, 200) + '...');
    console.log('📄 [GuidelineAssessment] Guideline preview (first 200 chars):', truncatedGuideline.substring(0, 200) + '...');

    console.log('🤖 [GuidelineAssessment] Creating InvokeModelCommand for model:', MODEL_ID);
    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body
    });
    console.log('✅ [GuidelineAssessment] Command created, sending to Bedrock...');

    console.log('⏳ [GuidelineAssessment] Waiting for Bedrock response...');
    const response = await sendWithRetry(client, command);
    console.log('✅ [GuidelineAssessment] Bedrock response received');

    if (!response.body) {
      console.error('❌ [GuidelineAssessment] No response body received from Bedrock');
      throw new Error('No response body received from Bedrock');
    }

    console.log('📖 [GuidelineAssessment] Transforming response body...');
    const responseText = await response.body.transformToString();
    console.log('📄 [GuidelineAssessment] Response text length:', responseText.length);

    console.log('🔍 [GuidelineAssessment] Parsing response JSON...');
    let responseBody: any;

    try {
      responseBody = JSON.parse(responseText);
      console.log('✅ [GuidelineAssessment] Response JSON parsed successfully');
    } catch (parseError) {
      console.error('❌ [GuidelineAssessment] Failed to parse AI response as JSON:', parseError);
      console.log('📄 [GuidelineAssessment] Raw response that failed to parse:', responseText);
      throw new Error('AI response is not valid JSON');
    }

    const raw = responseBody.content?.[0]?.text || '';
    console.log('🤖 [GuidelineAssessment] Raw AI response extracted, length:', raw.length);

    // Parse the AI response as JSON to extract qualityAssessment
    console.log('🔍 [GuidelineAssessment] Parsing AI response as JSON...');
    let qualityAssessment: string;

    try {
      const parsedResponse = JSON.parse(raw);
      qualityAssessment = parsedResponse.qualityAssessment || '';
      console.log('✅ [GuidelineAssessment] AI response JSON parsed successfully');
    } catch (parseError) {
      console.log('⚠️ [GuidelineAssessment] Direct JSON parsing failed, trying regex fallback...');

      // Fallback: try to extract JSON using regex
      const jsonMatch = raw.match(/\{[\s\S]*"qualityAssessment"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = jsonMatch[0];
          console.log('🔍 [GuidelineAssessment] Extracted JSON with regex:', extractedJson.substring(0, 200) + '...');

          const parsedResponse = JSON.parse(extractedJson);
          qualityAssessment = parsedResponse.qualityAssessment || '';
          console.log('✅ [GuidelineAssessment] Regex-extracted JSON parsed successfully');
        } catch (regexParseError) {
          console.error('❌ [GuidelineAssessment] Regex fallback also failed:', regexParseError);
          throw new Error('AI response is not valid JSON and regex fallback failed');
        }
      } else {
        console.error('❌ [GuidelineAssessment] No JSON pattern found in response');
        console.log('📄 [GuidelineAssessment] Raw response that failed to parse:', raw);
        throw new Error('No valid JSON found in AI response');
      }
    }

    if (!qualityAssessment) {
      console.error('❌ [GuidelineAssessment] No qualityAssessment found in parsed response');
      throw new Error('No qualityAssessment found in AI response');
    }

    // Validate that the assessment is meaningful (not just an error or placeholder)
    const trimmedAssessment = qualityAssessment.trim();
    if (trimmedAssessment.length < 50) {
      console.warn('⚠️ [GuidelineAssessment] Assessment seems too short, may be incomplete');
    }

    if (trimmedAssessment.toLowerCase().includes('assessment error') ||
        trimmedAssessment.toLowerCase().includes('unable to complete')) {
      console.warn('⚠️ [GuidelineAssessment] Assessment contains error indicators');
    }

    console.log('📊 [GuidelineAssessment] Final assessment validation:', {
      length: trimmedAssessment.length,
      startsWithHeader: trimmedAssessment.startsWith('#'),
      containsError: trimmedAssessment.toLowerCase().includes('error'),
      preview: trimmedAssessment.substring(0, 100) + '...'
    });

    // Create the response object
    const assessmentResponse: GuidelineAssessmentResponse = {
      projectId,
      sectionId,
      qualityAssessment
    };

    // Console log what we're returning
    console.log('📤 [GuidelineAssessment] Returning response object:');
    console.log('📄 [GuidelineAssessment] Response:', JSON.stringify(assessmentResponse, null, 2));
    console.log('📄 [GuidelineAssessment] Assessment length:', qualityAssessment.length);
    console.log('📄 [GuidelineAssessment] Assessment preview:', qualityAssessment.substring(0, 200) + '...');

    return assessmentResponse;

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

    return errorResponse;
  }
};
