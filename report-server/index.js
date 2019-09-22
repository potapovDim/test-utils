const Koa = require('koa2')

const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const fs = require('fs')
const path = require('path')

const app = new Koa()
const {router} = require('./lib-reporter/routs')

app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())


app.listen(3000);