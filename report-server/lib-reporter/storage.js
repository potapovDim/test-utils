const moment = require('moment')
const {dateFormat} = require('./constants')
const {isRequiredFormat} = require('./utils')
const {buildPeriodReport} = require('./periodReportBuilder')

function assertDateFormat(date) {
  if(isRequiredFormat(date)) {
    return
  }

  throw new Error(`
    Date ${date} should be in format: ${dateFormat} \n
    Please use reporter server client
  `)
}

// date should be in format MMM Do YY
// from moment moment().format('MMM Do YY')

// storage should link
function addNewBuildDescription(date, buildDescription, storage) {
  // assert date format
  assertDateFormat(date)

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
  // assert date format
  assertDateFormat(date)

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


module.exports = {
  addNewBuildDescription,
  addNewTestCaseToBuild,
  buildPeriodReport
}