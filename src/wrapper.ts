import type { Parser } from 'peggy';
import safeMode from './safeMode';
import { MAAPInpParser } from './types';

/**
 * Wraps the parser with additional logic.
 *
 * @param parser - The parser to wrap.
 * @returns The wrapped parser.
 */
export default function wrapper(parser: Parser): MAAPInpParser {
  const maapInpParser: MAAPInpParser = {
    options: {
      safeMode: true,
    },
    parse: (input, options) => {
      return safeMode(parser, input, {
        ...maapInpParser.options,
        ...options,
      });
    },
  };
  return maapInpParser;
}
