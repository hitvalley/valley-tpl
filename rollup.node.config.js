export default {
  input: 'src/output/vm-view.js',
  output: {
    file: 'dist/valleymodule-tpl.js',
    format: 'cjs'
  },
  external: [
    'valley-module',
    'fs',
    'path'
  ]
};
