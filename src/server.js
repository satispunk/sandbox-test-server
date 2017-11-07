const express = require('express')
const bodyParser = require('body-parser')
const {promisify} = require('util');

const MemoryFS = require("memory-fs");
const webpack = require("webpack");
const VirtualModulePlugin = require('virtual-module-webpack-plugin');

const fs = require('fs')
const path = require('path')
const uuid = require('uuid/v1')

const content = (code) => `
import React from 'react'
import ReactDOM from 'react-dom'

const element = ${code}

ReactDOM.render(
<div className="sandbox">
{element}
</div>,
  document.getElementById('app')
);`


class ReactSandbox {
  constructor() {
    this.elements = {}
    this.app = express()
    this.app.use(bodyParser.json())
    
    this.app.get('/script/:id', (req, res) => {
      const uuid = req.params.id
      
      res.type('js')
      res.send(this.elements[uuid])
    })
    
    this.app.get('/:id', (req, res) => {
      const {id} = req.params
      
      res.status(200)
      res.send(`
<!doctype>
<html>
  <head>
  </head>
  <body>
  <div id="app"/>
  <script src="/script/${id}"></script>
  </body>
</html>
  `)
    
    })
    
    this.listen = promisify(this.listen).bind(this)
  }
  
  listen(port, callback) {
    this.app.listen(port, callback)
  }
  
  
  registerElement(code) {
    return new Promise((resolve) => {
      const key = uuid()
      
      const entry = path.resolve(__dirname, `./assets/index.js`)
      //fs.writeFileSync(entry, content(code))
      
      const memoryFs = new MemoryFS();
      const compiler = webpack({
        entry: {
          main: entry
        },
        output: {
          path: '/c',
          filename: './bundle.js'
        },
        plugins: [
          new VirtualModulePlugin({
            moduleName: entry,
            contents: content(code)
          })
        ],
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
      
      compiler.outputFileSystem = memoryFs;
      memoryFs.mkdirSync('/c');
      
      compiler.run((err) => {
        if (err)
          console.log(err)
        
        const content = memoryFs.readFileSync("/c/bundle.js");
        
        this.elements[key] = content
        
        resolve(key)
      });
    })
  }
}

module.exports = new ReactSandbox()