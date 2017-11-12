const path = require('path');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');

module.exports = ({ entry, outputFileName, code }) => ({
  entry: entry,
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
      moduleName: path.resolve(__dirname, '../sandbox-element'),
      contents: code
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$|sandbox-test-server/,
        exclude: /node_modules\/(?!(sandbox-test-server))/,
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
});
