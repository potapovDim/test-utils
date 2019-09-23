const fetch = require('node-fetch')

const {formReqBody, formReqHeader, formReqUrl, logRequest} = require('./util')

/**
 *
 * @param {string} method http method
 * @param {string} host
 * @param {object} param2
 */
async function _fetchy(method, host, {path, body = null, headers = {}, queries, token, basicAuth}) {

  if(method == 'GET') {
    body = undefined
  }

  const reqUrl = formReqUrl(host, path, queries)
  const reqBody = formReqBody(body)
  const reqHeaders = formReqHeader(headers, token, basicAuth, body, reqUrl, method)

  const respData = await fetch(reqUrl, {method, headers: reqHeaders, body: reqBody})

  const respHeaders = Array.from(respData.headers.entries()).reduce((acc, [key, value]) => (acc[key] = value) && acc, {})

  const responseBodyMethod = respHeaders['content-type'] && respHeaders['content-type'].includes("application/json") ? 'json' : 'text'

  const responseDataObj = {body: await respData[responseBodyMethod](), status: respData.status, url: reqUrl, method, headers: respHeaders}

  logRequest(reqUrl, reqHeaders, method, reqBody, responseDataObj)

  return responseDataObj
}

/**
 *
 * @param {string} host
 */
function fetchWrap(host) {
  return {
    patch: _fetchy.bind(_fetchy, "PATCH", host),
    get: _fetchy.bind(_fetchy, "GET", host),
    put: _fetchy.bind(_fetchy, "PUT", host),
    post: _fetchy.bind(_fetchy, "POST", host),
    del: _fetchy.bind(_fetchy, "DELETE", host)
  }
}

module.exports = {fetchWrap}