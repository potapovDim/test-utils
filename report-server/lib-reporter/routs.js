const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const {addNewBuildDescription, addNewTestCaseToBuild} = require('./storage')
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
const storage = {}

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

router.get('/create-server', (ctx) => {
  ctx.status = 200
  ctx.body = {data: 'OK'}
  return ctx
})

router.post('/add-new-build', (ctx) => {
  const {date, buildDescription} = ctx.request.body
  const result = addNewBuildDescription(date, buildDescription, storage)

  if(result) {
    ctx.status = 200
    ctx.body = {data: 'OK'}
  } else {
    ctx.status = 400
    ctx.body = {data: 'Bad data'}
  }
  return ctx

})

module.exports = {
  router
}
