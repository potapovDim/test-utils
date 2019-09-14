
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
