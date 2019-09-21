/**
 *
 * @param {array} build
 *
 */
function reformatBuildStructure(build) {
  // merge not uniq cases
  const notUqiqCases = build.reduce((mergedBuildCases, caseItem, index) => {
    // if itemUniq should be the same as index from call back index
    const itemIndexInBuildIndex = build.findIndex(({testCaseId}) => caseItem.testCaseId === testCaseId)

    const itemInMergedBuildCasesIndex = mergedBuildCases.findIndex(({testCaseId}) => caseItem.testCaseId === testCaseId)

    if(index !== itemIndexInBuildIndex && !mergedBuildCases[itemInMergedBuildCasesIndex]) {
      const firstInListCase = build[itemIndexInBuildIndex]

      // if was few retry we should have all results
      const firstCaseStackTraceError = Array.isArray(firstInListCase.stackTraceError)
        ? firstInListCase.stackTraceError
        : [firstInListCase.stackTraceError]

      firstInListCase.stackTraceError = [...firstCaseStackTraceError, build[index].stackTraceError]
      // add test case inMergePull
      mergedBuildCases.push(firstInListCase)

    } else if(index !== itemIndexInBuildIndex && mergedBuildCases[itemInMergedBuildCasesIndex]) {
      if(Array.isArray(mergedBuildCases[itemInMergedBuildCasesIndex].stackTraceError)) {
        mergedBuildCases[itemInMergedBuildCasesIndex].stackTraceError.push(build[index].stackTraceError)
      } else {
        // modify stackTraceError to array where current item stackTrace and new found item StackTrace
        mergedBuildCases[itemInMergedBuildCasesIndex].stackTraceError = [
          mergedBuildCases[itemInMergedBuildCasesIndex].stackTraceError,
          build[index].stackTraceError
        ]
      }
    } else {
      // in case if this test case is new just push this
      mergedBuildCases.push(caseItem)
    }

    return mergedBuildCases
  }, [])
}


/**
 * @param {number} days how many days should be described in filan report
 * @param {object} storage storage object
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

  const reportPeriod = Array.from(Array(days), (item /*item is useless */, index) => {
    // index starts from 0, bus substract day should be start from 1
    const dateSubsctract = index + 1
    const dayWhatShouldBeIncludedInReport = moment()
      .subtract(dateSubsctract, 'days')
      .format("MMM Do YY")

    return dayWhatShouldBeIncludedInReport
  })

  const storageDatesWhatShouldBeIncluded = Object
    .keys(storage)
    .filter((storageDayKey) => reportPeriod.includes(storageDayKey))


  return storageDatesWhatShouldBeIncluded.reduce((reportStructure, day) => {
    /**
     * @example dayData <object>
     * {
     *    'some build description': [
     *      {
     *        testCaseId: 'some test case id',
     *        stackTraceError: 'some test case fail error'
     *      }
     *    ]
     * }
     */
    const dayData = storage[day]

    const builds = Object.keys(dayData).reduce((buildReportStructure, build) => {
      /**
       * @example buildFailedCases <array<{testCaseId: string, stackTraceError: string}>>
       * [
       *  {
       *    testCaseId: 'some test case id',
       *    stackTraceError: 'some test case fail error'
       *  }
       * ]
      */

      const buildFailedCases = dayData[build]


    }, [])

  }, {})
}

module.exports = {
  reformatBuildStructure,
  buildPeriodReport
}