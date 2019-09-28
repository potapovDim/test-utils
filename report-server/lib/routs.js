const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
// new instance of the Router
const router = new Router()

/**
 * @storage [array<object>]
 * @example
 * [
 *  {
 *    id: string,
 *    build: string,
 *    date: string,
 *    stackTrace: string
 *  }
 * ]
 */

const storage = []


router.get('/view', (ctx) => {
  ctx.header['Content-Type'] = 'text/html'
  const indexStatic = fs.readFileSync(
    path.resolve(__dirname, './static/index.html'), {encoding: 'utf8'}
  )
  ctx.status = 200
  ctx.body = indexStatic
  return ctx
})

router.get('/script/index.js', (ctx) => {
  ctx.header['Content-Type'] = 'text/javascript'
  const indexStatic = fs.readFileSync(
    path.resolve(__dirname, './static/script/index.js'), {encoding: 'utf8'}
  )
  ctx.status = 200
  ctx.body = indexStatic
  return ctx
})

router.post('/add-new-case', (ctx) => {
  /**
   * @testCaseData
   * @example
   * {
   *  id: string,
   *  build: string,
   *  date: string,
   *  stackTrace: string
   * }
   *
   */
  const {testCaseData} = ctx.request.body

  storage.push(testCaseData)

  ctx.status = 200
  ctx.body = {data: 'OK'}

  return ctx
})

router.get('/get-test-cases', (ctx) => {
  ctx.status = 200
  ctx.body = [...storage]
  return ctx
})

module.exports = {
  router
}
