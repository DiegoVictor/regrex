import { z } from 'zod';

const flagsMap = z.enum([
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
]);

const schema = z.object({
  terms: z.array(z.string()).min(1),
  flags: z.array(flagsMap).optional(),
});

type Params = z.infer<typeof schema>;

export const grexParams = (data: Params): Params => schema.parse(data);
