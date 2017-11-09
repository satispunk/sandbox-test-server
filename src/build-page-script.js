const MemoryFS = require("memory-fs");
const webpack = require("webpack");
const VirtualModulePlugin = require("virtual-module-webpack-plugin");

const path = require("path");

const config = ({ entry, outputFileName }) => ({
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
      }
    ]
  }
});

module.exports = code => {
  const outputFileName = "page";

  return new Promise(resolve => {
    const entry = path.resolve(__dirname, `./client.js`);
    const memoryFs = new MemoryFS();
    const compiler = webpack(
      config({
        entry,
        outputFileName
      })
    );

    compiler.outputFileSystem = memoryFs;
    memoryFs.mkdirSync("/c");

    compiler.run(err => {
      if (err) console.log(err);

      resolve(memoryFs.readFileSync(`/c/${outputFileName}.js`));
    });
  });
};
