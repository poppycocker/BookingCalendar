import moment from 'moment'
import Util from './Util.js'

export default class DateProcessor {
  constructor(year, month, date, half) {
    if (!year) {
      this._d = new Date()
    } else if (year instanceof this.constructor || year instanceof Date) {
      this._d = new Date(year.getTime())
    } else {
      this._d = new Date(year, month - 1, date, !!half ? 12 : 0)
    }
  }
  clone() {
    return new DateProcessor(this)
  }
  getTime() {
    return this._d.getTime()
  }
  addDate(dates) {
    this._d.setDate(this._d.getDate() + dates)
  }
  equals(another) {
    const d1 = this._d
    const d2 = another._d
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDay() === d2.getDay() &&
      d1.getHours() === d2.getHours()
  }
  diffDays(another) {
    const m1 = this.moment()
    const m2 = another.moment()
    const diffHours = m1.diff(m2, 'h')
    return Util.halfRound(diffHours / 24)
  }
  moment() {
    return moment(this._d)
  }
}
