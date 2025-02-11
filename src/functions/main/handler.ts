import { APIGatewayProxyEvent } from 'aws-lambda';
import { promisify } from 'util';
import { exec } from 'child_process';

import * as validate from '@application/validators/grexParams';
import { ZodError } from 'zod';

export const main = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body);

    const { flags = [], terms } = validate.grexParams(body);

    const cmd = ['grex'];
    const parsedFlags = flags.map(
      (flag: string) => `${flag.length > 1 ? '--' : '-'}${flag}`,
    );
    if (parsedFlags.length > 0) {
      cmd.push(parsedFlags.join(' '));
    }

    if (terms.length > 0) {
      cmd.push(`"${terms.join('" "')}"`);
    }

    const shell = promisify(exec);
    const { stdout } = await shell(cmd.join(' '));

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

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Ops! Something goes wrong, try again later.',
      }),
    };
  }
};
