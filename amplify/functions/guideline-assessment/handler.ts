import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { FeasibilityStudySectionStatus } from '../../../shared';

const AWS_REGION = "ap-southeast-2";
const MODEL_ID = "anthropic.claude-3-5-sonnet-20241022-v2:0";

interface GuidelineAssessmentRequest {
  content: string;
  guideline: string;
  sectionName?: string;
}

interface GuidelineAssessmentResponse {
  qualityAssessment?: string;  // Markdown string
  percentComplete: number;
  status: FeasibilityStudySectionStatus;
}

export const handler = async (event: any) => {
  try {
    const { content, guideline, sectionName } = event.arguments as GuidelineAssessmentRequest;

    if (!content || !guideline) {
      throw new Error('Content and guideline are required');
    }

    const client = new BedrockRuntimeClient({ region: AWS_REGION });

    // Create the assessment prompt
    const systemPrompt = `You are an expert mining researcher and analytics specialist. Your task is to assess the quality and completeness of feasibility study content against provided guidelines.

**REQUIRED ASSESSMENT FORMAT:**
You must return a JSON object with exactly these properties:

{
  "qualityAssessment": "Markdown string with detailed analysis",
  "percentComplete": number (0-100),
  "status": "not_started" | "in_progress" | "complete"
}

**Assessment Instructions:**
1. Analyze the content against the guideline requirements
2. Determine completion percentage (0-100)
3. Assess status based on completion:
   - 0-25%: "not_started"
   - 26-75%: "in_progress"
   - 76-100%: "complete"
4. Provide detailed quality assessment in markdown format
5. Focus on mining industry standards and feasibility study requirements

**Content to Assess:** ${content}

**Guideline Requirements:** ${guideline}

**Section Name:** ${sectionName || 'Unknown'}

Return ONLY the JSON object, no additional text.`;

    const conversationHistory = [
      {
        role: 'user',
        content: systemPrompt
      }
    ];

    const body = JSON.stringify({
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1500,
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
    const aiResponse = responseBody.content?.[0]?.text || '';

    // Try to parse the AI response as JSON
    let assessmentResult: GuidelineAssessmentResponse;
    try {
      // Extract JSON from the response (AI might wrap it in markdown)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        assessmentResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      // Fallback to default values
      assessmentResult = {
        qualityAssessment: `Failed to parse AI assessment. Raw response: ${aiResponse}`,
        percentComplete: 0,
        status: 'not_started'
      };
    }

    // Ensure all required properties are present
    if (typeof assessmentResult.percentComplete !== 'number') {
      assessmentResult.percentComplete = 0;
    }
    if (!assessmentResult.status || !['not_started', 'in_progress', 'complete'].includes(assessmentResult.status)) {
      assessmentResult.status = 'not_started';
    }
    if (!assessmentResult.qualityAssessment) {
      assessmentResult.qualityAssessment = 'No quality assessment provided';
    }

    // Console log the result as requested
    console.log('Guideline Assessment Result:', JSON.stringify(assessmentResult, null, 2));

    return JSON.stringify(assessmentResult);

  } catch (error) {
    console.error('Error in guideline assessment:', error);

    const errorResponse: GuidelineAssessmentResponse = {
      qualityAssessment: `Error occurred during assessment: ${error instanceof Error ? error.message : 'Unknown error'}`,
      percentComplete: 0,
      status: 'not_started'
    };

    // Console log the error result
    console.log('Guideline Assessment Error Result:', JSON.stringify(errorResponse, null, 2));

    return JSON.stringify(errorResponse);
  }
};
