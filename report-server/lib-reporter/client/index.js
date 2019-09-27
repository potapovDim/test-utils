const {fetchWrap} = require('./request/fetch.wrap')

class ReporterClient {
  constructor(host) {
    this.fetch = fetchWrap(host)
  }

  async addNewCase(testCaseData) {
    return this.fetch.post({path: '/add-new-case', body: {testCaseData}})
  }

  async getCases(testCaseData) {
    return this.fetch.get({path: '/get-test-cases', body: {testCaseData}})
  }
}

module.exports = {
  ReporterClient
}
