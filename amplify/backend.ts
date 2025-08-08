import { defineBackend } from '@aws-amplify/backend';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { chatOrchestratorFunction } from './functions/chat-orchestrator/resource';
import { s3ProxyFunction } from './functions/s3-proxy/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  chatOrchestratorFunction,
  s3ProxyFunction,
});

// Look up the pre-existing S3 buckets by name
const airisBucket = Bucket.fromBucketName(
  backend.stack,                // scope
  'AirisImportedBucket', // logical id
  'airis-analytica-workspace-sharepoint-data-962000089408'   // actual bucket name
);

const akBucket = Bucket.fromBucketName(
  backend.stack,                // scope
  'AKImportedBucket',     // logical id
  'ak-bkt-exp-1'         // actual bucket name
);

// Give the Lambda role the S3 rights it needs
backend.s3ProxyFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      's3:GetObject',
      's3:PutObject',
      's3:DeleteObject',
      's3:ListBucket',
      's3:GetObjectVersion',
      's3:PutObjectAcl',
      's3:GetObjectAcl'
    ],
    resources: [
      airisBucket.bucketArn,        // the bucket itself
      `${airisBucket.bucketArn}/*`, // every object in it
      akBucket.bucketArn,           // the bucket itself
      `${akBucket.bucketArn}/*`,    // every object in it
    ],
  }),
);

// Give the chat orchestrator Lambda role the Bedrock rights it needs
backend.chatOrchestratorFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'bedrock:InvokeModel'
    ],
    resources: [
      'arn:aws:bedrock:ap-southeast-2::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0'
    ],
  }),
);
