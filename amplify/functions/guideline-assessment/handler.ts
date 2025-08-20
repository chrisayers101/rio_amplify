import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { GuidelineAssessmentResponse } from '../../../shared';
import type { FeasibilityStudyQualityRating } from '../../../shared/feasibilityStudy.types';

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

    if (!content || !guideline) {
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

    const client = new BedrockRuntimeClient({ region: AWS_REGION });

    // Create the system prompt with JSON-only requirement
    const systemPrompt = `You are an expert mining researcher and analytics specialist. Your task is to assess the quality and completeness of feasibility study content against provided guidelines.

**CRITICAL: You must return ONLY valid JSON. No additional text, no markdown formatting outside the JSON structure.**

**REQUIRED ASSESSMENT FORMAT:**
You must return a JSON object with exactly these three properties:

{
  "qualityAssessment": "Markdown string with detailed analysis",
  "qualityRating": "Unrated | Poor | Fair | Good | Excellent",
  "percentComplete": number
}

**Quality Rating Rules:**
- "Unrated" → insufficient content to assess
- "Poor" → major gaps, critical requirements missing
- "Fair" → partial coverage, multiple gaps present
- "Good" → most requirements addressed, minor gaps
- "Excellent" → comprehensive coverage, meets industry standards

**Percent Complete Rules:**
- 0–20 → very incomplete, minimal content
- 21–50 → partial draft, some sections covered
- 51–80 → substantial progress, most sections addressed
- 81–99 → nearly complete, minor items remaining
- 100 → fully complete, all requirements met

**Assessment Instructions:**
1. Analyze the content against the guideline requirements
2. Provide detailed quality assessment in markdown format
3. Focus on mining industry standards and feasibility study requirements
4. Include strengths, gaps, and recommendations in your assessment
5. Determine quality rating based on content completeness and quality
6. Calculate percent complete based on guideline coverage
7. Return ONLY the JSON object, no additional text or formatting

**IMPORTANT: If you cannot complete the assessment for any reason, return this JSON instead:**
{
  "qualityAssessment": "# Assessment Error\\n\\nUnable to complete assessment. Please try again or contact support.",
  "qualityRating": "Unrated",
  "percentComplete": 0
}

**Content to Assess:** ${truncatedContent}

**Guideline Requirements:** ${truncatedGuideline}

**Section Name:** ${sectionName || 'Unknown'}

Return ONLY the JSON object with the three required properties.`;

    const conversationHistory = [
      {
        role: 'user',
        content: systemPrompt
      }
    ];

    const body = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 2500,
      temperature: 0,
      messages: conversationHistory
    });

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body
    });

    const response = await sendWithRetry(client, command);

    if (!response.body) {
      throw new Error('No response body received from Bedrock');
    }

    const responseText = await response.body.transformToString();

    let responseBody: any;

    try {
      responseBody = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error('AI response is not valid JSON');
    }

    const raw = responseBody.content?.[0]?.text || '';

    // Parse the AI response as JSON to extract qualityAssessment
    let qualityAssessment: string;
    let qualityRating: FeasibilityStudyQualityRating;
    let percentComplete: number;

    try {
      const parsedResponse = JSON.parse(raw);
      qualityAssessment = parsedResponse.qualityAssessment || '';
      qualityRating = parsedResponse.qualityRating || 'Unrated';
      percentComplete = parsedResponse.percentComplete || 0;
    } catch (parseError) {
      // Fallback: try to extract JSON using regex
      const jsonMatch = raw.match(/\{[\s\S]*"qualityAssessment"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = jsonMatch[0];

          const parsedResponse = JSON.parse(extractedJson);
          qualityAssessment = parsedResponse.qualityAssessment || '';
          qualityRating = parsedResponse.qualityRating || 'Unrated';
          percentComplete = parsedResponse.percentComplete || 0;
        } catch (regexParseError) {
          throw new Error('AI response is not valid JSON and regex fallback failed');
        }
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    }

    if (!qualityAssessment) {
      throw new Error('No qualityAssessment found in AI response');
    }

    // Validate that the assessment is meaningful (not just an error or placeholder)
    const trimmedAssessment = qualityAssessment.trim();
    if (trimmedAssessment.length < 50) {
      // Assessment seems too short, may be incomplete
    }

    if (trimmedAssessment.toLowerCase().includes('assessment error') ||
        trimmedAssessment.toLowerCase().includes('unable to complete')) {
      // Assessment contains error indicators
    }

    // Clamp percentComplete to 0-100 range
    percentComplete = Math.max(0, Math.min(100, percentComplete));

    // Create the response object
    const assessmentResponse: GuidelineAssessmentResponse = {
      projectId,
      sectionId,
      qualityAssessment,
      qualityRating,
      percentComplete
    };

    return assessmentResponse;

  } catch (error) {
    const errorResponse: GuidelineAssessmentResponse = {
      projectId: event.arguments?.projectId || 'unknown',
      sectionId: event.arguments?.sectionId || 'unknown',
      qualityAssessment: `# Assessment Error

An error occurred during the guideline assessment: ${error instanceof Error ? error.message : 'Unknown error'}

Please try again or contact support if the issue persists.`,
      qualityRating: 'Unrated',
      percentComplete: 0
    };

    return errorResponse;
  }
};
