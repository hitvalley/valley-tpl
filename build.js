// import uglify from 'rollup-plugin-uglify';
// import babel from 'rollup-plugin-babel';
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
// const uglify = require('rollup-plugin-uglify');
const uglify = require('uglify-js');
const fs = require('fs');

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

const fileName = 'dist/valley-tpl';
const rollupOption = {
  input: 'src/output/index.js',
  output: {
    file: `${fileName}.js`,
    format: 'iife',
    name: 'vtpl'
  },
  context: "window",
  plugins: [
    babel(babelOption),
  ]
};

rollup.rollup(rollupOption)
  .then(bundle => bundle.generate(rollupOption.output))
  .then(({ code }) => {
    const fileOption = {
      encoding: 'utf-8'
    };
    fs.writeFileSync(rollupOption.output.file, code, fileOption);
    const minifyCode = uglify.minify(code, {
      output: {
        ascii_only: true
      },
      compress: {
        pure_funcs: [ 'makeMap' ]
      }
    }).code;
    fs.writeFileSync(`${fileName}.min.js`, minifyCode, fileOption);
  });
