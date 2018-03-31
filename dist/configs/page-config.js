const path = require('path');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');

module.exports = ({ dirname, entryCode, outputFileName, code }) => {
  const entryModuleName = './client.js';
  const moduleName = './sandbox-element.js';

  return {
    mode: 'development',
    entry: entryModuleName,
    output: {
      path: '/c',
      filename: `./${outputFileName}.js`
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    },
    plugins: [
      new VirtualModulePlugin({
        moduleName: entryModuleName,
        contents: entryCode
      }),
      new VirtualModulePlugin({
        moduleName: moduleName,
        contents: code
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$|sandbox-element/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                require('babel-preset-env'),
                require('babel-preset-react')
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  };
};
