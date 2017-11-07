const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MemoryFS = require("memory-fs");
const webpack = require("webpack");

const fs = require('fs')
const path = require('path')

const elements = {}

app.use(bodyParser.json())

const content = `
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('app')
);`

app.get('/script/:id', (req, res) => {
  const entry = path.resolve(__dirname, `./assets/index-${req.params.id}.js`)
  fs.writeFileSync(entry,  content)
  
  const memoryFs = new MemoryFS();
  const compiler = webpack({
    entry: entry,//`./src/assets/index-${req.params.id}.js`,
    output: {
      path: '/c/bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                require('babel-preset-env'),
                require('babel-preset-react')
              ]
            }
          }
        }
      ]
    }
  });
  
  compiler.inputFileSystem = memoryFs;
  compiler.resolvers.normal.fileSystem = memoryFs;
  compiler.outputFileSystem = memoryFs;
  
  memoryFs.mkdirSync('/c');
//   memoryFs.writeFileSync("/c/index.js", `
// import React from 'react'
// import ReactDOM from 'react-dom'
//
// ReactDOM.render(
//   <h1>Hello, world!</h1>,
//   document.getElementById('app')
// );`)
  
  
  compiler.run((err, stats) => {
    if (err)
      console.log(err)
    
    console.log(stats)
    
    // Read the output later:
    const content = memoryFs.readFileSync("/c/bundle.js");
    
    res.type('js')
    res.send(content)
  });
})

app.get('/:id', (req, res) => {
  const {id} = req.params
  
  if (!elements.hasOwnProperty(id)) {
    return res.sendStatus(404)
  }
  
  res.status(200)
  res.send(`
<!doctype>
<html>
  <head>
  </head>
  <body>
  <div class="app"/>
  </body>
</html>
  `)
  
})

app.post('/', (req, rest) => {

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})