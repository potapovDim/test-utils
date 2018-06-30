function buildTable(rootTbl) {
  const emptyArr = []
  const tbl = rootTbl.querySelector('tbody')
  const footer = rootTbl.querySelector('tfoot')

  let tblHeader = rootTbl.querySelector('thead')

  let headerCells = null
  let bodyRows = null

  if(!tblHeader) {
    tblHeader = tbl.querySelectorAll('tr')[0]
    headerCells = tblHeader.querySelectorAll('td')
    bodyRows = emptyArr.splice.call(tbl.querySelectorAll('tr'), 1, tbl.querySelectorAll('tr').length - 1)
  } else {
    headerCells = tblHeader.querySelectorAll('th')
    bodyRows = tbl.querySelectorAll('tr')
  }

  const headerHash = emptyArr.reduce.call(headerCells, function(acc, current, index) {
    const isCheckbox = !!current.querySelector('input[type="checkbox"]')

    let title = current.innerText.trim()
    acc[
      !title.length && !isCheckbox
        ? 'EmptyTitle' : !title.length && isCheckbox
          ? 'Checkbox' : title.length && isCheckbox ?
            (title += 'Checkbox') : title] = index
    return acc
  }, {})

  const bodyData = emptyArr.map.call(bodyRows, function(row) {

    if(row.querySelectorAll('td').length === 1) {
      return row.querySelector('td').innerText.trim()
    }

    return Object.keys(headerHash).reduce(function(acc, current, index, hashArr) {
      if(row.querySelectorAll('td').length !== hashArr.length) {return acc}
      acc[current] = row.querySelectorAll('td')[index].innerText.trim()
      return acc
    }, {})
  }).filter(function(rowObj) {return !!Object.keys(rowObj).length})

  if(footer) {
    const futterInfo = Object.keys(headerHash).reduce(function(acc, current, index) {
      const footerCells = footer.querySelectorAll('td')
      if(footerCells[headerHash[current]].innerText.length) {
        acc['total' + current] = footerCells[index].innerText.trim()
      }
      return acc
    }, {})
    bodyData.push(futterInfo)
  }
  return bodyData
}