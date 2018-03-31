module.exports = {
  mode: 'development',
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    path: '/c',
    filename: './vendor.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
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
      },
      {
        test: require.resolve('react'),
        use: [
          {
            loader: 'expose-loader',
            options: 'React'
          }
        ]
      },
      {
        test: require.resolve('react-dom'),
        use: [
          {
            loader: 'expose-loader',
            options: 'ReactDOM'
          }
        ]
      }
    ]
  }
};
