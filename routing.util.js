const routs = require('./routs.json')
const os = require('os')

const winOS = os.platform() === 'win32'

const ifIe = (cmd) => cmd.includes('RUN_BROWSER=ie')

const getCommand = (cmd, hubUrl, serverUrl) => winOS
  ? `$env:REMOTE_URL=${hubUrl} $env:SERVER_HELPER=${serverUrl} ${cmd}`
  : `REMOTE_URL=${hubUrl} SERVER_HELPER=${serverUrl} ${cmd}`

function getRoutCommand(originalCmd) {
  for(let i = 0; i < routs.length; i++) {
    if(ifIe(originalCmd)) {
      if(routs[i].iecurrentCount < routs[i].iecount) {
        routs[i].iecurrentCount += 1
        function cmdExecutableCB() {routs[i].iecurrentCount -= 1}
        return {
          cmd: getCommand(originalCmd, routs[i].url, routs[i].serverUrl),
          cmdExecutableCB
        }
      }
    } else {
      if(routs[i].currentCount < routs[i].count) {
        routs[i].currentCount += 1
        function cmdExecutableCB() {routs[i].currentCount -= 1}
        return {
          cmd: getCommand(originalCmd, routs[i].url, routs[i].serverUrl),
          cmdExecutableCB
        }
      }
    }
  }
}

module.exports = {
  getRoutCommand
}