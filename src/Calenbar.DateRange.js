import Util from './Util.js'

export default class DateRange {
  constructor(start, finish) {
    this._start = start.clone()
    this._finish = finish.clone()
    this.correct()
  }
  get start() {
    return this._start
  }
  set start(date) {
    this._start = date.clone()
    this.correct()
  }
  get finish() {
    return this._finish
  }
  set finish(date) {
    this._finish = date.clone()
    this.correct()
  }

  get days() {
    return this._finish.diffDays(this._start)
  }

  shift(days) {
    this._start.shift(days)
    this._finish.shift(days)
    return this
  }

  correct() {
    if (this._start.getTime() <= this._finish.getTime()) {
      return
    }
    const tmp = this._start
    this._start = this._finish
    this._finish = tmp
  }

  doesIntersectWith(another) {
    const s1 = this._start.moment()
    const s2 = another.start.moment()
    const f1 = this._finish.moment()
    const f2 = another.finish.moment()
    return f1.diff(s2) > 0 && f2.diff(s1) > 0
  }

  clone() {
    return new DateRange(this._start.clone(), this._finish.clone())
  }

  toString() {
    return `${this._start.toString()}-${this._finish.toString()}`
  }
}
