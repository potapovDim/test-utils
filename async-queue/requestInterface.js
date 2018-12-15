const fetch = require('node-fetch')

// default headers object
const defaultHeader = {'Content-Type': 'application/json'}

async function _fetchy({slowTime = 0, method, timeout, url, body, headers = defaultHeader}) {

  // if method GET body should be undefined
  if(method == "GET") body = undefined

  // body shoud be JSON
  body = typeof body === 'object' ? JSON.stringify(body) : body

  if(slowTime) {await (() => new Promise(res => setTimeout(res, slowTime)))()}

  const response = await fetch(url, {
    method,
    headers,
    timeout,
    body
  })

  const contentType = response.headers.get("content-type")

  if(contentType && contentType.includes("application/json")) {
    const body = await response.json()
    if(response.status > 300) {
      throw new Error(`
      Something went wrong with request, pleace check driver server connection ${await response.text()}`)
    }
    return {body, headers: response.headers}
  } else {
    if(response.status > 300) {
      throw new Error(`
        Something went wrong with request, pleace check driver server connection ${await response.text()}`
      )
    }
    return {body: await response.text(), headers: response.headers}
  }
}

module.exports = {
  _fetchy
}