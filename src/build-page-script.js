const MemoryFS = require('memory-fs');
const webpack = require('webpack');
const path = require('path');

const pageConfig = require('./configs/page-config');

module.exports = ({ code, replacePageConfig }) => {
  const outputFileName = 'page';

  return new Promise((resolve, reject) => {
    const entry = path.resolve(__dirname, `./client.js`);
    const memoryFs = new MemoryFS();

    const baseConfig = pageConfig({
      entry,
      code,
      outputFileName
    });
    const config =
      typeof replacePageConfig === 'function'
        ? replacePageConfig(baseConfig)
        : baseConfig;

    const compiler = webpack(config);

    compiler.outputFileSystem = memoryFs;
    memoryFs.mkdirSync('/c');

    compiler.run((err, stats) => {
      console.log(stats.toString('normal'));

      if (err) return reject(err);
      if (stats.compilation.errors && stats.compilation.errors.length)
        return reject(stats.compilation.errors[0]);

      resolve(memoryFs.readFileSync(`/c/${outputFileName}.js`));
    });
  });
};
