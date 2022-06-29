import { Parser } from 'peggy';
import type { MAAPInpParserOutput, WrapperOptions } from './types';

/**
 * Attempts to avoid parsing errors by commenting out problematic lines and re-parsing.
 *
 * @param parser - The Peggy parser.
 * @param input - The input to parse.
 * @param options - Options passed to the parser.
 * @param errors - Running list of errors used for recursion.
 * @returns The best possible parsing of the input.
 */
export default function safeMode(
  parser: Parser,
  input: string,
  options?: WrapperOptions,
  errors: Parser['SyntaxError'][] = [],
): MAAPInpParserOutput {
  try {
    return {
      errors,
      input,
      output: parser.parse(input, options),
    };
  } catch (err) {
    const syntaxError = err as Parser['SyntaxError'];
    if (syntaxError.location && options?.safeMode !== false) {
      const inputLines = input.split('\n');
      const line = syntaxError.location.start.line - 1;
      inputLines[line] = `// ${inputLines[line]}`;
      return safeMode(
        parser,
        inputLines.join('\n'),
        options,
        errors.concat(syntaxError),
      );
    } else {
      throw err;
    }
  }
}
