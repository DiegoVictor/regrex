import { APIGatewayProxyEvent } from 'aws-lambda';
import { promisify } from 'util';
import { exec } from 'child_process';

import * as validate from '@application/validators/grexParams';
import { ZodError } from 'zod';

export const main = async (event: APIGatewayProxyEvent) => {
  const { terms, flags } = JSON.parse(event.body);

  const parsedFlags = flags
    .filter((key: string) => flagsMap.includes(key))
    .map((flag: string) => `${flag.length > 1 ? '--' : '-'}${flag}`);

  const cmd = `grex ${parsedFlags.join(' ')} "${terms.join('" "')}"`;

  const shell = promisify(exec);
  const { stdout } = await shell(cmd);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
    body: stdout,
  };
};
