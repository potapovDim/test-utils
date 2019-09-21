const moment = require('moment')
const {dateFormat, invalidDate} = require('./constants')

function isRequiredFormat(date) {
  return !(moment(date, dateFormat).format(dateFormat) === invalidDate)
}

module.exports = {
  isRequiredFormat
}