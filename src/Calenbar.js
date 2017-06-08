import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
import Record from './Calenbar.Bar.js'

export default class Calenbar {
  /**
   * Constructs the object.
   *
   * @param {string} id - id of container element
   * @param {array<Row>} rows - array of row object
   * @param {object} opts - options
   */
  constructor(id, rows, opts) {
    opts = opts || {}
    let el = document.getElementById(id)
    /**
     *  drawing surface
     *  @type {Snap.Element}
     */
    this._surface = Snap(el).addClass('booking-calendar')
    /**
     * records
     * @type {array<Record>}
     */
    this._records = []
    /**
     * rows
     * @type {array<Row>}
     */
    this._rows = rows
    /**
     * current center position as date.
     * initial value is today.
     * @type {Date}
     */
    this._currentCenter = new Date()

    opts.records = opts.records || []
    opts.records.forEach(record => this.putRecord(record))

    this.render()
  }
  get records() {
    // shallow copy
    return [].concat(this._records)
  }
  get rows() {
    // copy
    return Object.assign({}, this._rows)
  }
  get center() {}
  /**
   * set given date center of view
   * @param      {Date}  date
   */
  set center(date) {}
  /**
   * Puts a record.
   *
   * @param      {Calenbar.Record}  record  The record
   * @return     {boolean} success / failed
   * @fires      put
   */
  putRecord(record) {
    if (this.canPutRecord(record)) {
      return false
    }
    record.calendar = this
    this._records.push(record)
    return true
  }
  /**
   * Removes a record.
   *
   * @param      {string}  id  record id to remove
   * @return     {boolean} success / failed
   * @fires      remove
   */
  removeRecord(id) {
    let idx = this._records.findIndex(record => record.id === id)
    if (idx === -1) {
      return false
    }
    this._records[idx].release()
    this._records.splice(idx, 1)
    return true
  }
  findRecord(id) {
    return this._records.find(record => record.id === id)
  }
  canPutRecord(record) {
    // check: is already put
    if (record.calendar) {
      return false
    }
    // check: is row id valid
    if (!this._rows[record.rowId]) {
      return false
    }
    // check: id uniqueness
    if (this.findRecord(record.id)) {
      return false
    }
    // check: date range intersection
    return !this.doesIntersectWith(record)
  }
  doesIntersectWith(record) {
    return this._records
      .filter(r => r.id !== record.id)
      .filter(r => r.rowId === record.rowId)
      .some(r => {
        return record.doesIntersectWith(r)
      });
  }
  /**
   * render function
   */
  render() {
    this.make_grid()
  }
  make_grid() {
    
  }
  notifyChange(record) {}
}

Calenbar.Record = Record
