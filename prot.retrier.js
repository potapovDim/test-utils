
const path = require('path')
const fs = require('fs')
const {exec} = require('child_process')
const fetch = require('node-fetch')

let sessionCount = 10

const tryParse = (arg) => {
  try {
    return JSON.parse(arg)
  } catch(error) {
    return arg
  }
}

const workDir = './specs'


Array.prototype.shuffle = function() {
  const input = this

  for(let i = input.length - 1; i >= 0; i--) {

    const randomIndex = Math.floor(Math.random() * (i + 1));
    const itemAtIndex = input[randomIndex]

    input[randomIndex] = input[i]
    input[i] = itemAtIndex
  }
  return input
}

const specsDirBase = path.resolve(process.cwd(), workDir)

const envOpts = process.env

let failed = []

const runPromise = (cmd) => new Promise((res, rej) => {
  const proc = exec(cmd)
  let fail = null
  proc.on('exit', () => {
    res(fail)
  })

  proc.stderr.on('data', (data) => {
    // console.log(data.toString(), 'ERR')
  })

  proc.stdout.on('data', (data) => {
    const out = data.toString()
    if(out.includes('Process exited with error code 1')) {
      fail = cmd
    }
  })
})

const walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir)

  filelist = filelist || []

  files.forEach(function(file) {
    if(fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist)
    }
    else {
      filelist.push(path.join(dir, file))
    }
  })
  return filelist
}

// console.log(walkSync(specsDirBaseSmoke))

const formCommand = (filePath) => {
  return `./node_modules/.bin/protractor  ./protractor.conf.js  --specs ${filePath}`
}

const arrayToSubArrays = (arr, formedArr = [], arrLenth = 8) => {
  if(arr.length >= arrLenth) {
    formedArr.push(arr.splice(0, 8))

    return arrayToSubArrays(arr, formedArr, arrLenth)

  } else if(arr.length < arrLenth) {
    formedArr.push(arr.splice(0, arr.length))
  }
  return formedArr
}

function prepareExecution() {
  const files = walkSync(specsDirBase)
  const commands = filesIe.map((file) => formCommand(file))


  return commands
}

async function exeRun(runs, failArr) {
  runs = runs || prepareExecution()
  let currentSubRun = 0
  const now = +Date.now()
  const secondRerun = []
  const thirRerun = []
  const lastRerun = []

  failArr = failArr || failed

  const runLength = runs.length

  async function getEmptyRunns() {
    const remote1Empty = tryParse((await fetch(remote1).then(resp => resp.json()))).used

    const emptyRun = sessionCount /*- remote2Empty*/ - remote1Empty
    return emptyRun
  }

  let asserter = null

  function tryRerun(runsArr, pushArr) {
    asserter = setInterval(async () => {

      const emptyRun = await getEmptyRunns()

      const runArr = runsArr.splice(0, emptyRun).map(run => runPromise(run))
      currentSubRun += runArr.length
      await Promise.all(runArr).then((cmd) => {

        currentSubRun -= runArr.length
        pushArr.push(...cmd.filter(cm => !!cm))
      })

    }, 4000)
  }

  tryRerun(runs, secondRerun)

  do {
    const emptyRun = await getEmptyRunns()

    const runMap = runs.splice(0, emptyRun).map(run => runPromise(run))

    await Promise.all(runMap).then((cmd) => {

      secondRerun.push(...cmd.filter(cm => !!cm))
    }).catch(e => console.error(e.toString()))

  } while(runs.length || currentSubRun)
  console.log(currentSubRun, 'CURRENT RERUN SHOULD BE 0')

  clearInterval(asserter)
  asserter = null

  console.log(secondRerun.length, '!!!!!!!!!!!!!!!!!!')

  tryRerun(secondRerun.shuffle(), thirRerun)

  do {
    const emptyRun = await getEmptyRunns()

    const runMap = secondRerun.splice(0, emptyRun).map(run => runPromise(run))

    await Promise.all(runMap).then((cmd) => {
      thirRerun.push(...cmd.filter(cm => !!cm))
    }).catch(e => console.error(e.toString()))

  } while(secondRerun.length || currentSubRun)
  console.log(currentSubRun, 'CURRENT RERUN SHOULD BE 0')

  clearInterval(asserter)
  asserter = null

  console.log(thirRerun.length, '!!!!!!!!!!!!!!!!!!')

  tryRerun(thirRerun, lastRerun)

  do {
    const emptyRun = await getEmptyRunns()

    const runMap = thirRerun.splice(0, emptyRun).map(run => runPromise(run))

    await Promise.all(runMap).then((cmd) => {
      lastRerun.push(...cmd.filter(cm => !!cm))
    }).catch(e => console.error(e.toString()))

  } while(thirRerun.length || currentSubRun)
  console.log(currentSubRun, 'CURRENT RERUN SHOULD BE 0')

  clearInterval(asserter)

  asserter = null

  return lastRerun
}

async function runWithRetry() {


  const lastRerun = secondIterationFail = await exeRun(undefined, [])

  if(lastRerun.length) {
    process.exit(100)
  }

  console.log('_____________________________________________ execution retrie run end')
  process.exit(0)
}

runWithRetry()
