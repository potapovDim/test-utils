const moment = require('moment')

// date should be in format MMM Do YY
// from moment moment().format('MMM Do YY')

// storage should link
function addNewBuildDescription(date, buildDescription, storage) {
  // if storage does not contain date add new date to storage
  if(!storage[date]) {
    storage[date] = {}
  }
  // add new build description as a new empty array
  storage[date][buildDescription] = []

  // true as a success
  return true
}


function addNewTestCaseToBuild(date, buildDescription, testCaseData, storage) {
  if(!storage[date]) {
    storage[date] = {}
  }

  if(!storage[date][buildDescription]) {
    storage[date][buildDescription] = []
  }

  storage[date][buildDescription].push(testCaseData)

  // true as a success

  return true
}


function buildWeekReport() {

  const currnetData = moment().format("MMM Do YY")
}
