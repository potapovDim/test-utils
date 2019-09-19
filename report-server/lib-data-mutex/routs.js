const Router = require('koa-router')



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

router.get('*', (ctx) => {
  ctx.status = 200
  ctx.body = 'OK'
  return ctx
});


router.post('/create-server', (ctx) => {

  console.log(ctx.request.body)
  ctx.status = 200
  ctx.body = 'OK'
  return ctx
})


module.exports = {
  router
}