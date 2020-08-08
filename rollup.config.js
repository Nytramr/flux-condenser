// rollup.config.js
import { terser } from "rollup-plugin-terser";
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: 'index.js',
  output: {
    file: 'build/index.js',
    format: 'cjs',
    plugins: [
      terser(),
    ]
  },
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' }),
  ],
};