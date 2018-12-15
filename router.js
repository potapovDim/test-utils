const fs = require('fs')
const fetch = require('node-fetch')

const Reset = '\x1b[0m'
const Bright = '\x1b[1m'
const Dim = '\x1b[2m'
const Underscore = '\x1b[4m'
const Blink = '\x1b[5m'
const Reverse = '\x1b[7m'
const Hidden = '\x1b[8m'

const FgBlack = '\x1b[30m'
const FgRed = '\x1b[31m'
const FgGreen = '\x1b[32m'
const FgYellow = '\x1b[33m'
const FgBlue = '\x1b[34m'
const FgMagenta = '\x1b[35m'
const FgCyan = '\x1b[36m'
const FgWhite = '\x1b[37m'

const BgBlack = '\x1b[40m'
const BgRed = '\x1b[41m'
const BgGreen = '\x1b[42m'
const BgYellow = '\x1b[43m'
const BgBlue = '\x1b[44m'
const BgMagenta = '\x1b[45m'
const BgCyan = '\x1b[46m'
const BgWhite = '\x1b[47m'

async function isPresentRoutes(failCB) {
  const isRouterExists = fs.existsSync('./routs.json')
  if(isRouterExists) {
    console.log(BgGreen, 'Router file exists and', Reset)
    const routs = require('./routs.json')
    for(const item of routs) {
      console.log(FgYellow, '-----------------------------------------', Reset)
      console.log(FgBlue, `${item.description}`)
      console.log(`${item.count} threads for this machine`)
      console.log(FgYellow, '-----------------------------------------', Reset)

      const respSelenoid = await fetch(`${item.url}/status`).then((resp) => resp.status).catch(console.error)
      const respHelperServer = await fetch(`${item.serverUrl}`).then((resp) => resp.status).catch(console.error)
      const respStandalone = await fetch(`${item.ieUrl}`).then((resp) => resp.status).catch(console.error)

      if(respSelenoid === 200) {
        console.log(BgGreen, 'Selenoid instance works as expected', Reset)
      } else if(respSelenoid !== 200) {
        console.log('\n\n\n\n')
        console.log(Underscore)
        console.log(BgRed, 'Somethid went wrong with selenoid instance ', Reset)
        console.log(Underscore)
        console.log(BgRed, `${item.machineIP} please check this machine, selenoid should be started`, Reset)
        console.log('\n\n\n\n')
        failCB && failCB()
      }

      if(respHelperServer === 200) {
        console.log(BgGreen, 'Server helper works as expected', Reset)
      } else if(respHelperServer !== 200) {
        console.log('\n\n\n\n')
        console.log(Underscore)
        console.log(BgRed, 'Somethid went wrong with helper server', Reset)
        console.log(Underscore)
        console.log(BgRed, 'Cases what work with file downloads will not work !!!!', Reset)
        console.log(Underscore)
        console.log(BgRed, `${item.machineIP} please check this machine, helper server should be started`, Reset)
        console.log('\n\n\n\n')
        failCB && failCB()
      }

      if(respStandalone === 200) {
        console.log(BgGreen, 'Selenium standalone works as expected', Reset)
      } else if(respStandalone !== 200) {
        console.log('\n\n\n\n')
        console.log(Underscore)
        console.log(BgRed, 'Somethid went wrong with Selenium standalone server', Reset)
        console.log(Underscore)
        console.log(BgRed, 'ie only Cases will not work !!!!', Reset)
        console.log(Underscore)
        console.log(BgRed, `${item.machineIP} please check this machine, selenium standalone server should be started`, Reset)
        console.log('\n\n\n\n')
        failCB && failCB()
      }
    }
  } else {
    console.error(FgRed, '-----------------------------------------')
    console.error('Something wend wrong with router file')
    console.error('need to chect that file routs.json exists in current directory')
    console.error('-----------------------------------------', Reset)
    failCB && failCB()
  }
}

async function executionWatcher(failCB) {
  const routs = require('./routs.json')
  for(const item of routs) {
    const respSelenoid = await fetch(`${item.url}/status`).then((resp) => resp.status).catch(console.error)
    const respHelperServer = await fetch(`${item.serverUrl}`).then((resp) => resp.status).catch(console.error)
    const respStandalone = await fetch(`${item.ieUrl}`).then((resp) => resp.status).catch(console.error)

    if(respSelenoid !== 200) {
      console.log('\n\n\n\n')
      console.log(Underscore)
      console.log(BgRed, 'Somethid went wrong with selenoid instance ', Reset)
      console.log(Underscore)
      console.log(BgRed, `${item.machineIP} please check this machine, selenoid should be started`, Reset)
      console.log('\n\n\n\n')
      failCB && failCB()
    }

    if(respHelperServer !== 200) {
      console.log('\n\n\n\n')
      console.log(Underscore)
      console.log(BgRed, 'Somethid went wrong with helper server', Reset)
      console.log(Underscore)
      console.log(BgRed, 'Cases what work with file downloads will not work !!!!', Reset)
      console.log(Underscore)
      console.log(BgRed, `${item.machineIP} please check this machine, helper server should be started`, Reset)
      console.log('\n\n\n\n')
      failCB && failCB()
    }

    if(respStandalone !== 200) {
      console.log('\n\n\n\n')
      console.log(Underscore)
      console.log(BgRed, 'Somethid went wrong with Selenium standalone server', Reset)
      console.log(Underscore)
      console.log(BgRed, 'ie only Cases will not work !!!!', Reset)
      console.log(Underscore)
      console.log(BgRed, `${item.machineIP} please check this machine, selenium standalone server should be started`, Reset)
      console.log('\n\n\n\n')
      failCB && failCB()
    }
  }
}

module.exports = {
  executionWatcher, isPresentRoutes
}
