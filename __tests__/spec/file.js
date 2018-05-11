import fs from 'fs';
import { join, extname } from 'path';

const config = {
  encoding: 'utf-8',
  viewPath: __dirname,
  extension: 'tpl',
  withExtend: true,
  scope: {},
  inBrowser: (function() {
    return this !== undefined && this === this.window;
  }())
};

export function writeTestFile(filename, data) {
  let name = extname(filename) ? filename : `${filename}.${config.extension}`;
  fs.writeFileSync(join(config.viewPath, name), data, {
    encoding: config.encoding
  });
}

export function removeTestFile(files) {
  files = typeof files === 'string' ? [files] : files;
  files.forEach(filename => {
    let name = extname(filename) ? filename : `${filename}.${config.extension}`;
    fs.unlinkSync(join(config.viewPath, name));
  });
}

export function getConfig() {
  return config;
};

