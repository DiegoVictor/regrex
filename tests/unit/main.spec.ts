import { APIGatewayProxyEvent } from 'aws-lambda';
import { main } from '../../src/functions/main/handler';

const mockExec = jest.fn();
jest.mock('util', () => ({
  promisify: () => mockExec,
}));

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
});
