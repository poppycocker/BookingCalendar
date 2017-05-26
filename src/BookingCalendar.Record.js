import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
import moment from 'moment'

export default class Record {
  /**
   * Constructs the object.
   *
   * @param {string} id - The identifier
   * @param {string} rowId - The row identifier
   * @param {Date} startDate - The start date
   * @param {Date} finishDate - The finish date
   * @param {Object} [customData] - The object contains customData
   */
  constructor(id, rowId, startDate, finishDate, customData) {
    this._id = id
    this._rowId = rowId
    this._start = moment(startDate)
    this._finish = moment(finishDate)
    this._customData = customData
    /**
     * calendar
     * @type {BookingCalendar}
     */
    this._calendar = null
  }
  get id() {
    return this._id
  }
  get rowId() {
    return this._rowId
  }
  get calendar() {
    return this._calendar
  }
  /**
   * bind to / release from calendar surface
   *
   * @param      {BookingCalendar?}  calendar    The base calendar to add this record.
   * @return     {boolean} success / failed
   */
  set calendar(calendar) {
    return calendar ? this.bindTo(calendar) : this.releaseFromCalendar()
  }
  get startDate() {
    return this._start.toDate()
  }
  set startDate(date) {
    this._start = moment(date)
    this.raiseChange()
  }
  get finishDate() {
    return this._finish.toDate()
  }
  set finishDate(date) {
    this._finish = moment(date)
    this.raiseChange()
  }
  /**
   * render function
   */
  render() {}
  raiseChange() {
    if (!this._calendar) {
      return
    }
    this._calendar.notifyChange(record)
  }
  doesIntersectWith(another) {
    let s1 = this._start
    let s2 = another._start
    let f1 = this._finish
    let f2 = another._finish
    return f1.diff(s2) > 0 && f2.diff(s1) > 0
  }
  bindTo(calendar) {
    if (this._calendar) {
      return false
    }
    this._calendar = calendar
    this.raiseChange()
  }
  releaseFromCalendar() {
    // remove event listener
    // remove self from calendar
    let calendar = this._calendar
    this._calendar = null
    calendar.removeRecord(this.id)
    return true
  }
}
