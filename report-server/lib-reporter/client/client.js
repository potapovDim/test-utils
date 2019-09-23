const {fetchWrap} = require('./request/fetch.wrap')

class ReporterClient {
  constructor(host) {
    this.fetch = fetchWrap(host)
  }

  async createNewBuild({date, buildDescription}) {
    return this.fetch.post({path: '/add-new-build', body: {date, buildDescription}})
  }

  async addTestCaseToBuild({date, buildDescription, testCaseData}) {
    return this.fetch.post({path: '/add-new-testcase-to-build', body: {date, buildDescription, testCaseData}})
  }

  async getPeriodReport() {
    return this.fetch.post({path: '/add-new-testcase-to-build', body: {date, buildDescription, testCaseData}})
  }
}