/* eslint-disable import/no-extraneous-dependencies */
import frontend from 'nmde-common/config/frontend.js';
import path from 'path';

export default frontend(
  path.resolve('src', 'index.ts'),
  path.resolve('dist'),
  {
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.pegjs$/,
          type: 'asset/source',
        },
      ],
    },
    output: {
      library: {
        name: 'maapInpParser',
        type: 'umd',
      },
      publicPath: '',
    },
  },
  'maap-inp-parser',
);
