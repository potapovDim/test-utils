const {expect} = require('chai')
const {reformatBuildStructure} = require('../../lib-reporter/periodReportBuilder')

describe('reformatBuildStructure', () => {
  it('positive reformat', () => {
    // not uniq cases
    const testCaseId1 = 'TEST1'
    const testCaseId2 = 'TEST2'
    const testCaseId3 = 'TEST3'

    const buildTestData = [
      {
        testCaseId: testCaseId1,
        stackTraceError: 'TEST STACK 1'
      },
      {
        testCaseId: testCaseId1,
        stackTraceError: 'TEST STACK 2'
      },
      {
        testCaseId: testCaseId1,
        stackTraceError: 'TEST STACK 3'
      },
      {
        testCaseId: testCaseId2,
        stackTraceError: 'TEST STACK 1'
      },
      {
        testCaseId: testCaseId2,
        stackTraceError: 'TEST STACK 2'
      },
      {
        testCaseId: testCaseId3,
        stackTraceError: 'TEST STACK 1'
      }
    ]
    // test case should be merged
    const reformatedBuild = reformatBuildStructure(buildTestData)

    expect(reformatedBuild.length).to.eql(3)
    expect(reformatedBuild.find(({testCaseId}) => testCaseId1 === testCaseId).stackTraceError.length).to.eql(3)
    expect(reformatedBuild.find(({testCaseId}) => testCaseId2 === testCaseId).stackTraceError.length).to.eql(2)
    expect(reformatedBuild.find(({testCaseId}) => testCaseId3 === testCaseId).stackTraceError.length).to.eql(1)
  })
})