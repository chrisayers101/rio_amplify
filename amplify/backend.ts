import { defineBackend } from '@aws-amplify/backend';
import { CfnOutput } from 'aws-cdk-lib';
// Function URLs are not required when using Amplify Data resolvers; leaving out
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Vpc, Subnet, SecurityGroup } from 'aws-cdk-lib/aws-ec2';

import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { chatOrchestratorFunction } from './functions/chat-orchestrator/resource';
import { s3ProxyFunction } from './functions/s3-proxy/resource';
import { openSearchProxyFunction } from './functions/opensearch-proxy/resource';
import { guidelineAssessmentFunction } from './functions/guideline-assessment/resource';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  chatOrchestratorFunction,
  s3ProxyFunction,
  openSearchProxyFunction,
  guidelineAssessmentFunction,
});

//////////////////////////////////////////
/////////OPEN SEARCH CONFIGURATION/////////
// backend.openSearchProxyFunction.resources.lambda.role?.addManagedPolicy( ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole') );
// const cfn = backend.openSearchProxyFunction.resources.cfnResources.cfnFunction; cfn.vpcConfig = { subnetIds: [ 'subnet-05f88037dc10c0873', 'subnet-0ab4716cb11409b4f', 'subnet-0de74d4e1afdea070', ], securityGroupIds: [ 'sg-00d72a863a170cba3', 'sg-088193fe6037fc397', 'sg-0cf9f1bad389498de', 'sg-0f2ccf02dd1e279dc', ], };

// Explicitly allow the Lambda to call the dev OpenSearch domain (does not modify the domain resource policy)
backend.openSearchProxyFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['es:ESHttpGet', 'es:ESHttpPost'],
    resources: ['arn:aws:es:ap-southeast-2:029109261863:domain/amplify-os-dev/*'],
  }),
);

//////////////////////////////////////////
/////////OPEN SEARCH CONFIGURATION/////////

// Look up the pre-existing S3 buckets by name
const airisBucket = Bucket.fromBucketName(
  backend.stack,                // scope
  'AirisImportedBucket', // logical id
  'airis-analytica-workspace-sharepoint-data-962000089408'   // actual bucket name
);

// Output the role ARN to help configure OpenSearch domain access policy
new CfnOutput(backend.stack, 'OpenSearchProxyLambdaRoleArn', {
  value: backend.openSearchProxyFunction.resources.lambda.role?.roleArn || 'unknown',
  description: 'IAM Role ARN for the opensearch-proxy Lambda to allow in OpenSearch domain access policy',
});

// No function URL; invoke via Amplify Data resolver

// Removed reading OpenSearch config from `config/opensearch.json`.
// Configuration now lives exclusively in `amplify/functions/opensearch-proxy/handler.ts`.

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

// Give the guideline assessment Lambda role the Bedrock rights it needs
backend.guidelineAssessmentFunction.resources.lambda.addToRolePolicy(
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

// Allow the OpenSearch proxy Lambda to call Bedrock embedding + Claude models
backend.openSearchProxyFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'bedrock:InvokeModel'
    ],
    resources: [
      'arn:aws:bedrock:ap-southeast-2::foundation-model/amazon.titan-embed-text-v2:0',
      'arn:aws:bedrock:ap-southeast-2::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0'
    ],
  }),
);

