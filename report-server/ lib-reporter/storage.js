const moment = require('moment')
const {dateFormat} = require('./constants')
const {isRequiredFormat} = require('./utils')

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
function buildPeriodReport(days = 7, storage) {

  const days = Array.from(Array(days), (item, index) => {
    // index starts from 0, bus substract day should be start from 1
    const dateSubsctract = index + 1
    const currnetData = moment().subtract(dateSubsctract, 'days').format("MMM Do YY")
    return
  })


  const storageDates = Object.keys(storage)




  return storageDates.reduce((reportStructure, ) => {

  }, {})

  const currnetData = moment().subtract(days, 'days').format("MMM Do YY")
  storage
}


module.exports = {
  addNewBuildDescription,
  addNewTestCaseToBuild,
  buildPeriodReport
}