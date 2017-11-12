const createTestCafe = require('testcafe');
const path = require('path');
const webpackMerge = require('webpack-merge');
let runner = null;

const sandbox = require('../dist/server');

createTestCafe('localhost', 1337, 1338)
  .then(testcafe => {
    runner = testcafe.createRunner();

    return testcafe.createBrowserConnection();
  })
  .then(() => {
    return sandbox.listen(3000);
  })
  .then(() => {
    sandbox.replaceVendorConfig(config => {
      return webpackMerge(config, {
        entry: {
          vendor: [
            'semantic-ui-react/dist/commonjs/umd',
            'semantic-ui-css/semantic.css'
          ]
        },
        module: {
          rules: [
            {
              test: require.resolve('semantic-ui-react/dist/commonjs/umd'),
              use: [
                {
                  loader: 'expose-loader',
                  options: 'semanticUIReact'
                }
              ]
            },
            {
              test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
              use: 'file-loader?name=[name].[ext]?[hash]'
            },
            {
              test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: 'url-loader?limit=10000&mimetype=application/fontwoff'
            }
          ]
        }
      });
    });

    sandbox.replacePageConfig(config => {
      return webpackMerge(config, {
        externals: {
          'semantic-ui-react': 'semanticUIReact'
        }
      });
    });

    return sandbox.build();
  })
  .then(() => {
    const testPath = path.resolve(__dirname, './tests.js');

    runner
      .src(testPath)
      .browsers(['chrome'])
      .run({
        speed: 0.01
      })
      .then(failedCount => {
        if (failedCount) {
          process.exit(1);
        }

        process.exit(0);
      })
      .catch(error => {
        console.log(error);
        process.exit(1);
      });
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
