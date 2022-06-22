import peggy from 'peggy';
import maapInpParser from './maapInpParser.pegjs';

export default peggy.generate(maapInpParser, {
  output: 'parser',
});
