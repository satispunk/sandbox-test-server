const MemoryFS = require("memory-fs");
const webpack = require("webpack");
const VirtualModulePlugin = require("virtual-module-webpack-plugin");

const path = require("path");

const config = ({entry, outputFileName, code}) => ({
  entry: entry,
  output: {
    path: "/c",
    filename: `./${outputFileName}.js`
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  },
  plugins: [
    new VirtualModulePlugin({
      moduleName: path.resolve(__dirname, "./sandbox-element"),
      contents: code
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$|sandbox-element/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            presets: [
              require("babel-preset-env"),
              require("babel-preset-react")
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

module.exports = code => {
  const outputFileName = "page";
  
  return new Promise((resolve, reject) => {
    const entry = path.resolve(__dirname, `./client.js`);
    const memoryFs = new MemoryFS();
    const compiler = webpack(
      config({
        entry,
        code,
        outputFileName
      })
    );
    
    compiler.outputFileSystem = memoryFs;
    memoryFs.mkdirSync("/c");
    
    compiler.run((err, stats) => {
      if (err)
        return reject(err)
      if (stats.compilation.errors && stats.compilation.errors.length)
        return reject(stats.compilation.errors[0])
      
      resolve(memoryFs.readFileSync(`/c/${outputFileName}.js`));
    });
  });
};
