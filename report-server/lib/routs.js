const path = require('path')
const fs = require('fs')
const {parseInt} = require('./utils')
// new instance of the Router
const Router = require('koa-router')
const router = new Router()

const {ADDAPTER = 'memory'} = process.env

const storage = require('./adapters')[ADDAPTER]

// view rout return index.html
router.get('/view', (ctx) => {
  ctx.header['Content-Type'] = 'text/html'
  const indexStatic = fs.readFileSync(
    path.resolve(__dirname, './static/index.html'), {encoding: 'utf8'}
  )
  ctx.status = 200
  ctx.body = indexStatic
  return ctx
})

// script static serving
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
   * @data
   * @example
   * {
   *  id: string,
   *  build: string,
   *  date: string,
   *  stackTrace: string
   * }
   *
   */
  const {data} = ctx.request.body

  storage.setToStorage(data)

  ctx.status = 200
  ctx.body = {data: 'OK'}

  return ctx
})

router.get('/get-test-cases', (ctx) => {
  ctx.status = 200
  ctx.body = storage.getStorageData(parseInt(ctx.request.query.offset), parseInt(ctx.request.query.limit))
  return ctx
})

module.exports = {
  router
}
