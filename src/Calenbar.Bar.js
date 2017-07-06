import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
import moment from 'moment'
import Observable from './Calenbar.Observable.js'

export default class Bar extends Observable {
  /**
   * Constructs the object.
   *
   * @param {string} rowId - The row identifier
   * @param {Date} startDate - The start date
   * @param {Date} finishDate - The finish date
   * @param {string?} [id] - The identifier of bar
   * @param {Object} [customData] - The object contains customData
   */
  constructor(rowId, startDate, finishDate, id, customData) {
    super()
    this._rowId = rowId
    this._start = moment(startDate)
    this._finish = moment(finishDate)
    this._id = id
    this._customData = customData
    /**
     * canvas
     * @type {Canvas}
     */
    this._canvas = null

    this._element = null

    this._dragOrigin = null
  }
  get id() {
    return this._id
  }
  set id(id) {
    this._id = id
    this.raiseChange()
  }
  get rowId() {
    return this._rowId
  }
  set rowId(rowId) {
    this._rowId = rowId
    this.raiseChange()
  }
  get canvas() {
    return this._canvas
  }
  /**
   * bind to / release from canvas surface
   *
   * @param      {Canvas?}  canvas    The base canvas to add this record.
   * @return     {boolean} success / failed
   */
  set canvas(canvas) {
    return canvas ? this.bindTo(canvas) : this.releaseFromCanvas()
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
  hasEffectiveId() {
    return !!this._id
  }
  /**
   * render function
   */
  render() {
    this._element ? this._modify() : this._create()
  }

  _create() {
    let config = this.canvas.config
    let p = this.canvas.gridPosToScreenPoint({
      rowId: this._rowId,
      date: this.startDate
    })
    let pad = config.bar.padding
    let x = pad + p.x
    let y = pad + p.y
    let w = config.grid.width * (this._finish.diff(this._start, 'days') + 1) - pad * 2
    let h = config.grid.height - pad * 2
    let r = config.bar.round
    this._element = this.canvas.snapElement.rect(x, y, w, h, r).attr({
      fill: config.bar.fill
    })
    this._setEventHandlers()
  }

  _modify() {
    let config = this.canvas.config
    let days = Math.floor((this.finishDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24))
    let pad = config.bar.padding
    let p = this.canvas.gridPosToScreenPoint({
      rowId: this._rowId,
      date: this.startDate
    })
    this._element.attr({
      x: pad + p.x,
      y: pad + p.y,
      width: config.grid.width * (Math.abs(days) + 1) - pad * 2
    })
    return this._element
  }

  _setEventHandlers() {
    this._element.hover(this._onHoverIn, this._onHoverOut, this, this)
    this._element.drag(this._onDragMove, this._onDragStart, this._onDragEnd, this, this, this)
  }

  _releaseEventHandlers() {
    this._element.unhover(this._onHoverIn, this._onHoverOut)
    this._element.drag()
  }

  _onHoverIn(e, x, y) {
    this._element.node.style.cursor = 'move'
  }
  _onHoverOut(e, x, y) {
    this._element.node.style.cursor = 'auto'
  }
  _onDragStart(x, y, e) {
    e.stopPropagation()
    this._dragOrigin = moment(this._start)
  }
  _onDragMove(dx, dy, x, y, e) {
    e.stopPropagation()
    let config = this.canvas.config
    let daysStart2Current = Math.floor(dx / config.grid.width)
    let daysStart2Prev = this._start.diff(this._dragOrigin, 'd')
    let daysPrev2Current = daysStart2Current - daysStart2Prev
    this._start.add(daysPrev2Current, 'd')
    this._finish.add(daysPrev2Current, 'd')

    if (!this._canvas.checkCollision(this)) {
      // reset
      this._start.diff(daysPrev2Current, 'd')
      this._finish.diff(daysPrev2Current, 'd')
      return
    }
    this.render()
  }
  _onDragEnd(e) {
    e.stopPropagation()
    this.raiseChange()
  }

  raiseChange() {
    // if (!this._canvas) {
    //   return
    // }
    // this._canvas.notifyChange(record)
  }
  doesIntersectWith(another) {
    let s1 = this._start
    let s2 = another._start
    // for range calculation, add 23:59 to finish date.
    let f1 = moment(this._finish).add(23, 'h').add(59, 'm')
    let f2 = moment(another._finish).add(23, 'h').add(59, 'm')
    return f1.diff(s2) > 0 && f2.diff(s1) > 0
  }
  bindTo(canvas) {
    if (this._canvas) {
      return false
    }
    this._canvas = canvas
    this.raiseChange()
  }
  releaseFromCanvas() {
    // remove event listener
    this._releaseEventHandlers()
    this.clearAllListener()
    // remove self from canvas
    this._element.remove()
    // this._canvas.removeBar(this.id)
    this._canvas = null
    return true
  }
}
