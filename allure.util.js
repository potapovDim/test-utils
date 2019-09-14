
// clear results, works with processRerun getSpecFilesArr
function allureCleanUp() {
  const reportFiles = getSpecFilesArr(path.resolve(__dirname, './allure-results'))
  reportFiles.forEach(function(file) {

    if(file.includes('-result.json')) {
      const executionResult = require(file)

      if(executionResult.status === 'passed') {
        executionResult.steps = []

        fs.unlinkSync(file)

        fs.writeFileSync(file, JSON.stringify(executionResult))
      }
    }
  })
}

async function findAllSteps(namePart) {
  let logins = 0
  async function sleep(ms = 5000) {
    return new Promise((res) => setTimeout(res, ms))
  }
  const runnedCases = document.querySelectorAll('.node__title')
  for(let i = 0; i < runnedCases.length; i++) {
    runnedCases[i].click()
    await sleep(100)

    const steps = document.querySelectorAll('.step__name')

    for(let i = 0; i < steps.length; i++) {
      if(steps[i].innerText.includes(namePart)) {
        console.log(steps[i].innerText)
        logins++
      }
    }
  }
  return logins
}
