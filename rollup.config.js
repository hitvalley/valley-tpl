import json from 'rollup-plugin-json';

export default {
  moduleName: 'Valley',
  entry: 'src/tpl-node.js',
  format: 'iife',
  plugins: [
    json()
  ],
  dest: 'dist/valleytpl.js'
}
