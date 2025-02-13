import { APIGatewayProxyEvent } from 'aws-lambda';
import { ZodError, ZodIssueCode, ZodParsedType } from 'zod';
import { main } from '../../src/functions/main/handler';

const mockExec = jest.fn();
jest.mock('util', () => ({
  promisify: () => mockExec,
}));

const mockGrexParams = jest.fn();
jest.mock('@application/validators/grexParams', () => {
  return {
    grexParams: (params: Record<string, any>) => mockGrexParams(params),
  };
});

describe('Main Function', () => {
  it('should be able to exec command and get a regex', async () => {
    const terms = ['sample', 'example', 'simple'];
    const flags = ['x', 'ignore-case'];

    const stdout = `
    (?x)
    ^
      (?:
        exa
        |
        s[ai]
      )
      mple
    $
    `;
    mockExec.mockResolvedValueOnce({
      stdout,
    });

    mockGrexParams.mockReturnValueOnce({ terms, flags });

    const response = await main({
      body: JSON.stringify({
        terms,
        flags,
      }),
    } as APIGatewayProxyEvent);

    const cmd = `grex ${flags
      .map((flag) => `${flag.length > 1 ? '--' : '-'}${flag}`)
      .join(' ')} "${terms.join('" "')}"`;

    expect(mockExec).toHaveBeenCalledWith(cmd);
    expect(response).toStrictEqual({
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: stdout,
    });
  });

  it('should be able to exec command and get a regex even without flags', async () => {
    const terms = ['sample', 'example', 'simple'];

    const stdout = `
    (?x)
    ^
      (?:
        exa
        |
        s[ai]
      )
      mple
    $
    `;
    mockExec.mockResolvedValueOnce({
      stdout,
    });

    mockGrexParams.mockReturnValueOnce({ terms });

    const response = await main({
      body: JSON.stringify({
        terms,
      }),
    } as APIGatewayProxyEvent);

    const cmd = `grex "${terms.join('" "')}"`;

    expect(mockExec).toHaveBeenCalledWith(cmd);
    expect(response).toStrictEqual({
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: stdout,
    });
  });

  it('should not be able to exec command and get a regex with validation errors', async () => {
    const terms = ['sample', 'example', 'simple'];
    const flags = ['x', 'ignore-case'];

    const stdout = `
    (?x)
    ^
      (?:
        exa
        |
        s[ai]
      )
      mple
    $
    `;
    mockExec.mockResolvedValueOnce({
      stdout,
    });

    const error = {
      message: 'fake error message',
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.integer,
      received: ZodParsedType.boolean,
      path: [''],
    };
    const zodError = new ZodError([error]);
    mockGrexParams.mockImplementationOnce(() => {
      throw zodError;
    });

    const response = await main({
      body: JSON.stringify({
        terms,
        flags,
      }),
    } as APIGatewayProxyEvent);

    expect(mockExec).not.toHaveBeenCalled();
    expect(response).toStrictEqual({
      statusCode: 400,
      body: JSON.stringify({
        message: 'Validation Failed',
        details: zodError.issues,
      }),
    });
  });

  it('should not be able to exec command and get a regex with validation errors', async () => {
    const terms = ['sample', 'example', 'simple'];
    const flags = ['x', 'ignore-case'];

    const stdout = `
    (?x)
    ^
      (?:
        exa
        |
        s[ai]
      )
      mple
    $
    `;
    mockExec.mockResolvedValueOnce({
      stdout,
    });

    mockGrexParams.mockImplementationOnce(() => {
      throw new Error('Unexpected Error');
    });

    const response = await main({
      body: JSON.stringify({
        terms,
        flags,
      }),
    } as APIGatewayProxyEvent);

    expect(mockExec).not.toHaveBeenCalled();
    expect(response).toStrictEqual({
      statusCode: 500,
      body: JSON.stringify({
        message: 'Oops! Something goes wrong, try again later.',
      }),
    });
  });
});
