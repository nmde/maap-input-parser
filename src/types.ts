import type { ParserOptions } from 'peggy';

export type WrapperOptions = ParserOptions & {
  safeMode?: boolean;
};

export type MAAPInp = {
  type: 'program';
  value: any[];
};

export type MAAPInpParserOutput = {
  errors: PEG.parser.SyntaxError[];
  input: string;
  output: MAAPInp;
};

export type MAAPInpParser = {
  options: WrapperOptions;
  parse(input: string, options?: WrapperOptions): MAAPInpParserOutput;
};
