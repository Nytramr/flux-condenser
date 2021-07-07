// rollup.config.js
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: 'main.js',
  output: [
    {
      name: 'flux-condenser',
      file: 'build/index.js',
      format: 'umd',
      plugins: [terser()],
    },
    {
      file: 'build/index.mjs',
      format: 'es',
      plugins: [terser()],
    },
  ],
  plugins: [resolve(), babel({ babelHelpers: 'bundled' })],
};
