import json from 'rollup-plugin-json';

export default {
  moduleName: 'Valley',
  entry: 'src/output/index-plus.js',
  format: 'iife',
  plugins: [
    json()
  ],
  dest: 'dist/valleytpl.js'
}
