const fs = require('fs');
const path = require('path');

function tranJs(source, target) {
  let list = fs.readdirSync(source);
  list.forEach(name => {
    let filename = path.join(source, name);
    let targetname = path.join(target, name);
    if (filename.match(/-spec\.js$/)) {
      console.log(filename)
      let content = fs.readFileSync(filename).toString();
      // console.log(content.toString())
      content.split(/[\n\r]+/).forEach((line, index) => {
        // console.log(index, line);
        if (line.match(/\.\.\/\.\.\/\.\./)) {
          line = line.replace(/\.\.\/\.\.\/\.\./, '../..')
        }
        if (line.match(/^describe/) || line === '});') {
          line = '';
        }
        if (line.match(/^  /)) {
          line = line.replace(/^  /, '');
        }
        if (line.match(/^it/)) {
          line = line.replace(/^it/, 'test');
        }
        console.log(line)
        fs.appendFileSync(targetname, `${line}\n`, {
          encoding: 'utf-8'
        });
      });
    }
  });
}

tranJs('../test/unit/spec/', 'spec');
