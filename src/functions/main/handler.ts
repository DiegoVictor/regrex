import { APIGatewayProxyEvent } from 'aws-lambda';
import { promisify } from 'util';
import { exec } from 'child_process';

import * as validate from '@application/validators/grexParams';
import { ZodError } from 'zod';

export const main = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body || '{}');

    const { flags = [], terms } = validate.grexParams(body);

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
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Validation fail',
          details: err.errors,
        }),
      };
    }

  }
};
