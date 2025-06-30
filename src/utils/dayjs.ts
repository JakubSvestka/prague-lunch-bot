require('dayjs/locale/cs')
const isToday = require("dayjs/plugin/isToday")
const customParseFormat = require('dayjs/plugin/customParseFormat')

const dayjs = require('dayjs')
dayjs.locale('cs')
dayjs.extend(isToday)
dayjs.extend(customParseFormat)

export default dayjs