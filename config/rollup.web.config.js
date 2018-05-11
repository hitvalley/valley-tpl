// import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import uglify from './uglify-plugin';

const babelOption = {
  babelrc: false,
  presets: [
    [
      "env",
      {
        "modules": false
      }
    ]
  ],
  plugins: [
    "external-helpers",
  ]
};

const filename = 'dist/valleytpl';
export default {
  input: 'src/output/index.js',
  output: {
    file: `${filename}.min.js`,
    format: 'iife',
    name: 'vtpl',
    sourcemap: true
  },
  context: "window",
  plugins: [
    babel(babelOption),
    uglify(`${filename}.js`)
  ]
};

