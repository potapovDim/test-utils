const URL = require('url')
const querystring = require('querystring')
const FormData = require('form-data')
const fs = require('fs')

function isObject(item) {
  return Object.prototype.toString.call(item) === '[object Object]' && item !== null
}

function logRequest(reqUrl, reqHeaders, reqMethod, reqBody, {body, status, headers}) {

  function itemToString(item) {
    return `${typeof item !== 'string' ? JSON.stringify(item, null, '\t') : item}`
  }

  const {DEBUG_PROCESS} = process.env

  if(DEBUG_PROCESS) {
    console.log('\n\n')
    console.log(`Request url: ${reqUrl}`)
    console.log(`Request headers: ${itemToString(reqHeaders)}`)
    console.log(`Request method: ${reqMethod}`)
    console.log(`Request body: ${itemToString(reqBody)}`)
    console.log('\n\n')
    console.log('********************************************')
    console.log('\n\n')
    console.log(`Response body: ${itemToString(body)}`)
    console.log(`Response status: ${status}`)
    console.log(`Response headers: ${itemToString(headers)}`)
  }
}

function formReqHeader(headers, token, basicAuth, body) {

  if(token) {
    headers['Authorization'] = basicAuth ? `Basic ${token}` : `Bearer ${token}`
  }

  if(!headers['Content-Type'] && body) {
    headers['Content-Type'] = 'application/json'
  }

  if(body instanceof FormData) {
    headers['Content-Type'] = body.getHeaders()['content-type']
  }

  if(headers.noNeeded) {
    headers = {}
  }

  return headers
}

function formReqUrl(host, path, queries) {
  if(queries) {
    if(typeof queries === 'string') {
      queries = queries.startsWith('?') ? queries : `?${queries}`
    } else {
      queries = `?${querystring.stringify(queries)}`
    }
    path = `${path}${queries}`
  }

  return URL.resolve(host, path)
}

function formReqBody(body) {
  if(isObject(body) && !body.hasOwnProperty('formData') || body === null) {
    return JSON.stringify(body, null, '\t')
  } else if(isObject(body) && body.hasOwnProperty('formData')) {
    const form = new FormData()
    const {fileName, filePath, contentType} = body.formData

    if(fs.existsSync(fileName)) {
      form.append(fileName, fs.createReadStream(filePath), {filename: fileName, contentType})
    }

    return form
  }

  return body
}

module.exports = {
  formReqBody,
  formReqUrl,
  formReqHeader,
  logRequest
}