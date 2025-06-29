require('dayjs/locale/cs')
const isToday = require("dayjs/plugin/isToday")

const dayjs = require('dayjs');
dayjs.locale('cs')
dayjs.extend(isToday)

export default dayjs