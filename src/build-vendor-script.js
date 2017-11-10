const MemoryFS = require('memory-fs');
const webpack = require('webpack');
const vendorConfig = require('./configs/vendor-config');

module.exports = ({ replaceVendorConfig }) => {
  return new Promise(resolve => {
    const config =
      typeof replaceVendorConfig === 'function'
        ? replaceVendorConfig(vendorConfig)
        : vendorConfig;

    const compiler = webpack(config);

    const memoryFs = new MemoryFS();
    compiler.outputFileSystem = memoryFs;
    memoryFs.mkdirSync('/c');
    compiler.run((err, stats) => {
      console.log(stats.toString('normal'));

      resolve(memoryFs.readFileSync('/c/vendor.js'));
    });
  });
};
