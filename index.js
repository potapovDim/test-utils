const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const util = require("util");
let URL = null 

const format = util.format;

util.format = (...args) => {
  const str = format.call(util, ...args);
  if (str.length > 10000) return str.slice(0, 10000) + "...";
  return str;
};

async function postFormData(pathUrl, opts = {}, mediaPath, filename, contentType = "image/jpg") {
  const form = new FormData();
  mediaPath = Array.isArray(mediaPath) ? mediaPath : [mediaPath]
  filename = Array.isArray(filename) ? filename : [filename]

  if (Array.isArray(filename) && Array.isArray(mediaPath)) {
    if (filename.length != mediaPath.length)
      console.warn('Names array length should equal paths array length');
    else {
      for (let i = 0; i < filename.length; i++) {
        form.append(filename[i], fs.createReadStream(path.join(__dirname, mediaPath[i])), {
          filename: filename[i],
          contentType
        });
      }
      const headers = form.getHeaders();
      if (opts.token) {
        headers.authorization = "Bearer " + opts.token;
      }
      const response = await fetch(URL + pathUrl, Object.assign({
        method: "POST", body: form, headers: headers
      }, opts));
      contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return { body: await response.json(), status: response.status, headers: response.headers };
      } else {
        return { body: await response.text(), status: response.status, headers: response.headers };
      }
    }
  }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function _fetchy(method, url, body, opts) {
  
  opts = opts || {};
  const headers = opts.headers || {};
  if (method == "GET")
    body = undefined;
  if (body != null) {
    headers["Content-Type"] = "application/json";
  }
  if (opts.token) {
    headers.authorization = "Bearer " + opts.token;
  }

  const response = await fetch(url, Object.assign({
    method, headers, body: typeof body === 'object' ? JSON.stringify(body) : body 
  }, opts));


  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const body = await response.json()
    return { body, status: response.status, headers: response.headers };
  } else {
    return { body: await response.text(), status: response.status, headers: response.headers };
  }
}

const fetchy = (method, path, body, opts) => _fetchy(method, URL + path, body, opts);


module.exports = function (host) {
  URL = host
  return {
    postFormData,
    util,
    fetchy_util: {
      get: fetchy.bind(global, "GET"),
      put: fetchy.bind(global, "PUT"),
      post: fetchy.bind(global, "POST"),
      del: fetchy.bind(global, "DELETE")
    },
    _fetchy: {
      get: _fetchy.bind(global, "GET"),
      put: _fetchy.bind(global, "PUT"),
      post: _fetchy.bind(global, "POST"),
      del: _fetchy.bind(global, "DELETE")
    }
  }
};
