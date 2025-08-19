import { defineFunction } from '@aws-amplify/backend';

export const guidelineAssessmentFunction = defineFunction({
  entry: './handler.ts',
  name: 'guideline-assessment',
  timeoutSeconds: 900 // 15 minutes
});
