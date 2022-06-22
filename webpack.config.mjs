/* eslint-disable import/no-extraneous-dependencies */
import frontend from 'nmde-common/config/frontend.js';
import path from 'path';

export default frontend(
  path.resolve('src', 'index.ts'),
  path.resolve('dist'),
  {
    output: {
      library: {
        type: 'commonjs',
      },
      publicPath: ''
    },
    module: {
      rules: [
        {
          test: /\.pegjs$/,
          type: 'asset/source',
        },
      ],
    },
  },
  'maap-inp-parser',
);
