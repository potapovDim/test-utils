/**
 * test case data example
 * @example cases
 * {
 *  id: string,
 *  build: string,
 *  date: string,
 *  stackTrace: string
 * }
 */
function getTestCases() {
  return fetch(`${window.origin}/get-test-cases`)
    .then(res => res.json())
    .then(renderCases)
    .catch(console.error)
}

function sortCasesById(cases) {

}


/**
 *
 * @param {array} cases
 * @returns {undefined}
 * @example cases
 * {
 *  id: string,
 *  build: string,
 *  date: string,
 *  stackTrace: string
 * }
 */
function renderCases(cases) {

  cases.forEach(function({id, build, date, stackTrace}) {

    const caseRootEl = document.createElement('div')
    const caseIdEl = document.createElement('h5')
    const caseBuildEl = document.createElement('div')
    const caseDateEl = document.createElement('div')
    const caseStackEl = document.createElement('div')

    caseIdEl.innerText = id
    caseBuildEl.innerText = build
    caseDateEl.innerText = date
    caseStackEl.innerText = JSON.stringify(stackTrace)

    caseRootEl.appendChild(caseIdEl)
    caseRootEl.appendChild(caseBuildEl)
    caseRootEl.appendChild(caseDateEl)
    caseRootEl.appendChild(caseStackEl)

    document.body.appendChild(caseRootEl)
  })
}
