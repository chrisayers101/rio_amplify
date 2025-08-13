import { defineBackend } from '@aws-amplify/backend';
import { CfnOutput } from 'aws-cdk-lib';
// Function URLs are not required when using Amplify Data resolvers; leaving out
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Vpc, Subnet, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { readFileSync } from 'fs';
import { join } from 'path';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { chatOrchestratorFunction } from './functions/chat-orchestrator/resource';
import { s3ProxyFunction } from './functions/s3-proxy/resource';
import { openSearchProxyFunction } from './functions/opensearch-proxy/resource';

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
});
// Explicitly allow the Lambda to call the dev OpenSearch domain (does not modify the domain resource policy)
backend.openSearchProxyFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['es:ESHttpGet', 'es:ESHttpPost'],
    resources: ['arn:aws:es:ap-southeast-2:029109261863:domain/amplify-os-dev/*'],
  }),
);

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

// Optionally: grant ES Http permissions from config domainArn(s)
try {
  const cfgPath = join(__dirname, '../config/opensearch.json');
  const raw = readFileSync(cfgPath, 'utf8');
  const cfg = JSON.parse(raw) as any;
  // Prefer top-level domainArn; fallback to domains[default].domainArn
  const key = cfg.default || 'dev';
  const domainArn = cfg.domainArn || cfg.domains?.[key]?.domainArn;
  if (domainArn) {
    backend.openSearchProxyFunction.resources.lambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['es:ESHttpGet', 'es:ESHttpPost'],
        resources: [`${domainArn}/*`],
      }),
    );
  }

  // Stop reading per-profile files; single-file config only

  // Optional VPC attach from config (same-account only)
  const vpcId = cfg.infra?.vpcId;
  const subnetIds = (cfg.infra?.subnetIds || []).filter(Boolean);
  const lambdaSgId = cfg.infra?.lambdaSecurityGroupId;
  if (vpcId && subnetIds.length >= 2 && lambdaSgId) {
    const vpc = Vpc.fromLookup(backend.stack, 'OsProxyVpc', { vpcId });
    const sg = SecurityGroup.fromSecurityGroupId(backend.stack, 'OsProxySg', lambdaSgId);
    backend.openSearchProxyFunction.resources.lambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['ec2:CreateNetworkInterface','ec2:DescribeNetworkInterfaces','ec2:DeleteNetworkInterface','ec2:DescribeVpcs','ec2:DescribeSubnets','ec2:DescribeSecurityGroups'],
        resources: ['*'],
      }),
    );
    // Do not call addEnvironment on IFunction; if needed, set env in function resource definition
    backend.openSearchProxyFunction.resources.lambda.addToRolePolicy(
      new PolicyStatement({ effect: Effect.ALLOW, actions: ['logs:CreateLogGroup','logs:CreateLogStream','logs:PutLogEvents'], resources: ['*'] }),
    );
    // Note: Function URL not created here; expose via API as needed
    // Note: In Amplify Gen2, attaching to VPC usually requires properties at defineFunction time.
    // If this does not attach, we should move this into the function resource definition file.
  }
} catch {}

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

