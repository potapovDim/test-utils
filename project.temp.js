const fs = require('fs')
const crypto = require('crypto')

// utils
function md5File(filePath) {

  const BUFFER_SIZE = 8192
  const fd = fs.openSync(filePath, 'r')
  const hash = crypto.createHash('md5')
  const buffer = Buffer.alloc(BUFFER_SIZE)

  try {

    let bytesRead

    do {
      bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE)
      hash.update(buffer.slice(0, bytesRead))
    } while(bytesRead === BUFFER_SIZE)
  } finally {
    fs.closeSync(fd)
  }

  return hash.digest('base64')
}
const isArrOfPrimitives = (arrItem) => {
  return Array.isArray(arrItem) && arrItem.every(item => {
    const typeOfItem = typeof item
    return ['string', 'number'].includes(typeOfItem)
  })
}

const isArrOfObjects = function(arrItem) {
  return Array.isArray(arrItem) && arrItem.every(item => {
    return Object.prototype.toString.call(item) === '[object Object]'
  })
}
// utils

const parseCsvFromString = (original, separator = ',', everyRowWithItems = true) => {
  const arrayData = original.split('\n')
  // header is first row
  const header = arrayData.shift().split(separator).map(item => item.trim())

  // check that every row has all items from header
  if(everyRowWithItems) {
    const rowWithNotAllItems = arrayData
      .find((item) => item
        .split(separator).length !== header.length
      )

    if(rowWithNotAllItems) {
      throw new Error(`
        Row headers: ${JSON.stringify(header)}
        Row with data: ${JSON.stringify(rowWithNotAllItems)} does not contain required fields.
      `)
    }
  }

  const lines = arrayData.map(item => item.split(separator));
  const uniqHeader = header.filter((item, index) => header.indexOf(item) === index);
  const objectView = lines.map((arrItem) => {
    return uniqHeader.reduce((acc, item) => {
      const indexes = []
      let index = header.indexOf(item);
      while(index !== -1) {
        indexes.push(index)
        index = header.indexOf(item, index + 1);
      }
      const values = indexes.map((i) => arrItem[i]);
      acc[item] = values.length === 1 ? values[0] : values;
      return acc;
    }, {});
  })

  return {
    original,
    arrayView: [header, ...lines],
    objectView
  }
}

const parseCsvFile = (filepath, separator = ',', everyRowWithItems = true) => {
  if(!filepath || !fs.existsSync(filepath)) {
    throw new Error(`File ${filepath} was not found`)
  }

  const original = fs.readFileSync(filepath).toString('utf8').trim()
  return parseCsvFromString(original, separator, everyRowWithItems)
}

const formCsvFileFromArray = (csvDataArray, separator = ',') => {

  return csvDataArray.reduce((acc, item, index, originArr) => {
    const isNewLine = originArr.length - 1 === index ? '' : '\n'

    if(isArrOfPrimitives(item)) {
      acc += item.join(separator).trim()
    } else if(isArrOfObjects(item)) {
      acc += item.reduce((rowAcc, row, rowIndex) => {
        const isSeparator = item.length - 1 === rowIndex ? '' : separator
        rowAcc += `${row.rowItemValue}${isSeparator}`
        return rowAcc
      }, '')
    } else if(typeof item === 'string') {
      acc += item
    }
    acc = `${acc}${isNewLine}`
    return acc
  }, '')
}

module.exports = {
  parseCsvFile,
  parseCsvFromString,
  formCsvFileFromArray,

  md5File
}
