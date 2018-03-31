const MemoryFS = require('memory-fs');
const webpack = require('webpack');
const entryTemplate = require('./entry-template');

const pageConfig = require('./configs/page-config');

module.exports = ({ code, replacePageConfig, dirname, props }) => {
  dirname = dirname || __dirname;

  const outputFileName = 'page';
  return new Promise((resolve, reject) => {
    const entryCode = entryTemplate(props);
    const memoryFs = new MemoryFS();

    const baseConfig = pageConfig({
      dirname,
      entryCode,
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
      console.log(
        stats.toString({
          assets: false,
          chunks: false,
          chunkModules: false,
          modules: false,
          version: false,
          hash: false,
          timings: false,
          builtAt: false,
          entrypoints: false
        })
      );

      if (err) return reject(err);
      if (stats.compilation.errors && stats.compilation.errors.length)
        return reject(stats.compilation.errors[0]);

      resolve(memoryFs.readFileSync(`/c/${outputFileName}.js`));
    });
  });
};
