const minify = require("uglify-es").minify;
const fs = require('fs');

export default function(filename) {
  // const options = Object.assign({ sourceMap: true }, userOptions);
  return {
    name: 'uglify',
    transformBundle(code) {
      // console.log(code)
      fs.writeFileSync(filename, code, 'utf-8');
      const result = minify(code, {
        sourceMap: true
      });
      if (result.error) {
        throw result.error;
      }
      return result;
    }
  }
}
