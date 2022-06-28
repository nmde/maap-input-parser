import { generate } from 'peggy';
import maapInpParser from './maapInpParser.pegjs';

export default generate(maapInpParser, {
  output: 'parser',
});
