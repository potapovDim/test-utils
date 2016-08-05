const util = require("util");
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const co = require('co');


function *postFormData(pathUrl, opts = {}, mediaPath, filename) {
  const form = new FormData();
  mediaPath = Array.isArray(mediaPath) ? mediaPath : [mediaPath]
  filename = Array.isArray(filename) ? filename : [filename]

  if (Array.isArray(filename) && Array.isArray(mediaPath)) {
    if (filename.length != mediaPath.length)
      console.log('Величина масиву імен повина відповідати довжині масиву шляхів');
    else {
      for (let i = 0; i < filename.length; i++) {
        form.append(filename[i], fs.createReadStream(path.join(__dirname, mediaPath[i])), {
          filename: filename[i],
          contentType: "image/jpg"
        });
      }
      const headers = form.getHeaders();
      if (opts.token) {
        headers.authorization = "Bearer " + opts.token;
      }
      const response = yield fetch("http://localhost:3001" + pathUrl, Object.assign({
        method: "POST", body: form, headers: headers
      }, opts));
      let contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return {body: yield response.json(), status: response.status, headers: response.headers};
      }
      else {
        return {body: yield response.text(), status: response.status, headers: response.headers};
      }
    }
  }
}

function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}

function *fetchy(method, url, body, opts) {
  opts=opts||{};
  const headers = opts.headers || {};
  let response;
  if (method == "GET")
    body = undefined;
  if (body != null) {
    headers["Content-Type"] = "application/json";
  }
  if (opts.token) {
    headers.authorization = "Bearer " + opts.token;
  }
  response = yield fetch(url, Object.assign({
    method, headers, body
  }, opts));

  let contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return {body: yield response.json(), status: response.status, headers: response.headers};
  }
  else {
    return {body: yield response.text(), status: response.status, headers: response.headers};
  }
}

function *_fetchy(method, path, body, opts) {
  return yield * _fetchy(method, "http://localhost:3001" + path, body, opts)
}

module.exports = {
  sleep,
  postFormData,
  _fetchy: {
    get: fetchy.bind(global, "GET"),
    put: fetchy.bind(global, "PUT"),
    post: fetchy.bind(global, "POST"),
    del: fetchy.bind(global, "DELETE"),
  },
  fetchy: {
    get: _fetchy.bind(global, "GET"),
    put: _fetchy.bind(global, "PUT"),
    post: _fetchy.bind(global, "POST"),
    del: _fetchy.bind(global, "DELETE"),
  }
};