const MemoryFS = require("memory-fs");
const webpack = require("webpack");

const config = {
  entry: {
    vendor: ["react", "react-dom"]
  },
  output: {
    path: "/c",
    filename: "./vendor.js"
  },
  module: {
    rules: [
      {
        test: require.resolve("react"),
        use: [
          {
            loader: "expose-loader",
            options: "React"
          }
        ]
      },
      {
        test: require.resolve("react-dom"),
        use: [
          {
            loader: "expose-loader",
            options: "ReactDOM"
          }
        ]
      }
    ]
  }
};

module.exports = () => {
  return new Promise(resolve => {
    const compiler = webpack(config);

    const memoryFs = new MemoryFS();
    compiler.outputFileSystem = memoryFs;
    memoryFs.mkdirSync("/c");
    compiler.run(() => {
      resolve(memoryFs.readFileSync("/c/vendor.js"));
    });
  });
};
