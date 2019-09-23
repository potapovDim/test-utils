const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const {addNewBuildDescription, addNewTestCaseToBuild, buildPeriodReport} = require('./storage')
// new instance of the Router
const router = new Router()

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

router.post('/add-new-testcase-to-build', (ctx) => {
  const {date, buildDescription, testCaseData} = ctx.request.body
  const result = addNewTestCaseToBuild(date, buildDescription, testCaseData, storage)

  if(result) {
    ctx.status = 200
    ctx.body = {data: 'OK'}
  } else {
    ctx.status = 400
    ctx.body = {data: 'Bad data'}
  }
  return ctx
})

router.post('/period-report', (ctx) => {
  const {period} = ctx.request.body
  const result = buildPeriodReport(period, storage)

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
