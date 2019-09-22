const Router = require('koa-router')
const path = require('path')
const fs = require('fs')

/**
 * @storage
 * @example storage
 * {
 *  // execution date
 *  // date should have some standart format
 *  date: {
 *    // build description
 *    'some build description': [
 *      {
 *        testCaseId: 'some test case id',
 *        stackTraceError: 'some test case fail error'
 *      }
 *    ]
 *  }
 * }
 */
const storage = {

}

const router = new Router()

// router.get('*', (ctx) => {
//   ctx.status = 200
//   ctx.body = 'OK'
//   return ctx
// });


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
    path.resolve(__dirname, './static/index.js'), {encoding: 'utf8'}
  )
  ctx.status = 200
  ctx.body = indexStatic
  return ctx
})


router.post('/create-server', (ctx) => {

  console.log(ctx.request.body)
  ctx.status = 200
  ctx.body = 'OK'
  return ctx
})


module.exports = {
  router
}