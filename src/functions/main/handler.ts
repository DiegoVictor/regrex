import { APIGatewayProxyEvent } from 'aws-lambda';

const flagsMap = [
  'd',
  'digits',
  'D',
  'non-digits',
  's',
  'spaces',
  'S',
  'non-spaces',
  'w',
  'words',
  'W',
  'non-words',
  'r',
  'repetitions',
  'e',
  'escape',
  'with-surrogates',
  'i',
  'ignore-case',
  'g',
  'capture-groups',
  'x',
  'verbose',
  'no-start-anchor',
  'no-end-anchor',
  'no-anchors',
];

export const main = async (event: APIGatewayProxyEvent) => {
  const { terms, flags } = JSON.parse(event.body);

  const parsedFlags = flags
    .filter((key: string) => flagsMap.includes(key))
    .map((flag: string) => `${flag.length > 1 ? '--' : '-'}${flag}`);
};
