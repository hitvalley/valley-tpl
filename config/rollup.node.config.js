export default {
  input: 'src/output/node.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  external: [
    'valley-module',
    'fs',
    'path'
  ]
};
