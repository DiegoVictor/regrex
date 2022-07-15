import type { AWS } from '@serverless/typescript';

import main from '@functions/main';

const serverlessConfiguration: AWS = {
  service: 'regrex',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: { main },
  package: { individually: true, exclude: ['dependencies'] },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  layers: {
    Grex: {
      name: 'Grex',
      path: 'dependencies',
      package: {
        artifact: 'dependencies.zip',
      },
    },
  },
};

module.exports = serverlessConfiguration;
