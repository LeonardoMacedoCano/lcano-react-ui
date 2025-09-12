import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  // Build JS ESM/CJS
  {
    input: 'src/index.ts',
    output: [
      { dir: 'dist/esm', format: 'esm', sourcemap: true },
      { dir: 'dist/cjs', format: 'cjs', sourcemap: true }
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.build.json', jsx: 'react-jsx' })
    ]
  },

  // Build apenas tipos
  {
    input: 'src/index.ts',
    output: { dir: 'dist/types' }, // Rollup exige output, mas JS não é gerado
    plugins: [
      typescript({ tsconfig: './tsconfig.types.json' })
    ]
  }
];
