const express = require('express');
const fs = require('fs');
const promisify = require('util.promisify');
const htmlTemplate = require('./html-template');
const buildVendorScript = require('./build-vendor-script');
const buildPageScript = require('./build-page-script');
const uuid = require('uuid/v1');
const path = require('path');
const HttpShutdown = require('http-shutdown');

class SandboxServer {
  constructor() {
    this.cache = {};
    this.app = express();
    this.app.get('/script/vendor', (req, res) => {
      if (!this.vendorContent) return res.sendStatus(404);

      res.type('js');
      res.send(this.vendorContent);
    });

    this.app.get('/script/:id', (req, res) => {
      const uuid = req.params.id;

      res.type('js');
      res.send(this.cache[uuid]);
    });

    this.app.get('/:id', (req, res) => {
      const id = req.params.id;

      res.status(200);
      res.send(htmlTemplate(id));
    });

    this.listen = promisify(this.listen).bind(this);
    this.close = promisify(this.close).bind(this);
  }

  listen(port, callback) {
    this.server = HttpShutdown(
      this.app.listen(port, () => {
        this.port = port;
        callback();
      })
    );
  }

  close(callback) {
    if (this.server) {
      delete this.port;
      this.server.shutdown(callback);
    }
  }

  build() {
    return buildVendorScript({
      replaceVendorConfig: this.replaceVendorConfigCallback
    }).then(content => {
      this.vendorContent = content;
    });
  }

  replacePageConfig(callback) {
    this.replacePageConfigCallback = callback;
  }

  replaceVendorConfig(callback) {
    this.replaceVendorConfigCallback = callback;
  }

  render(code, dirname) {
    return buildPageScript({
      dirname,
      code,
      replacePageConfig: this.replacePageConfigCallback
    }).then(content => {
      const key = uuid();
      this.cache[key] = content;

      return {
        url: `http://localhost:${this.port}/${key}`,
        id: key
      };
    });
  }

  renderFromFile(filepath) {
    return this.render(
      fs.readFileSync(filepath).toString(),
      path.dirname(filepath)
    );
  }
}

module.exports = new SandboxServer();
