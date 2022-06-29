import { generate } from 'peggy';
import maapInpParser from './maapInpParser.pegjs';
import wrapper from './wrapper';

export default wrapper(
  generate(maapInpParser, {
    output: 'parser',
  }),
);
