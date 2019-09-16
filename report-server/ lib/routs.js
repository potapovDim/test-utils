const Router = require('koa-router')


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