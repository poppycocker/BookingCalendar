import Util from './Util.js'
import Observable from './Calenbar.Observable.js'
import DateRange from './Calenbar.DateRange.js'

export default class Bar extends Observable {
  /**
   * Constructs the object.
   *
   * @param {string} rowId - The row identifier
   * @param {Date} startDate - The start date
   * @param {Date} finishDate - The finish date
   * @param {object} [options] - options
   *   @param {string} [options.id] - The identifier of bar
   *   @param {boolean} [options.lock] - Lock this bar or not
   */
  constructor(rowId, startDate, finishDate, options) {
    super()
    this._rowId = rowId
    this._dateRange = new DateRange(startDate, finishDate)
    const opts = options || {}
    this._id = opts.id
    this._lock = opts.lock || false
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
    if (this._lock) {
      return this
    }
    this._id = id
    this.raiseChange()
    return this
  }
  get rowId() {
    return this._rowId
  }
  set rowId(rowId) {
    if (this._lock) {
      return this
    }
    this._rowId = rowId
    this.raiseChange()
    return this
  }
  get canvas() {
    return this._canvas
  }
  /**
   * bind to / release from canvas surface
   *
   * @param      {Canvas?}  canvas    The base canvas to add this record.
   * @return     {Calenbar.Bar} this
   */
  set canvas(canvas) {
    canvas ? this.bindTo(canvas) : this.releaseFromCanvas()
    return this
  }
  get dateRange() {
    return this._lock ? this._dateRange.clone() : this._dateRange
  }
  set dateRange(dateRange) {
    if (this._lock) {
      return this
    }
    this._dateRange = dateRange
    this.raiseChange()
    return this
  }
  get lock() {
    return this._lock
  }
  set lock(lock) {
    this._lock = lock
  }

  /**
   * render function
   */
  render() {
    this._element ? this._modify() : this._create()
  }

  _create() {
    const config = this._canvas.config
    const p = this._canvas.gridPosToScreenPoint({
      rowId: this._rowId,
      date: this._dateRange.start
    })
    const style = this._getDrawingStyle()
    const pad = style.padding
    const x = pad + p.x
    const y = pad + p.y
    const w = config.grid.width * this._dateRange.days - pad * 2
    const h = config.grid.height - pad * 2
    const r = style.round
    this._element = this._getLayerToAppend().rect(x, y, w, h, r)
    this._setStyle(style)
    this._setEventHandlers()
  }

  _setStyle(style) {
    this._element.attr({
      fill: style.fill,
      stroke: style.stroke,
      strokeWidth: style.strokeWidth
    })
  }

  _modify() {
    const config = this._canvas.config
    const days = this._dateRange.days
    const style = this._getDrawingStyle()
    const pad = style.padding
    const p = this._canvas.gridPosToScreenPoint({
      rowId: this._rowId,
      date: this._dateRange.start
    })
    this._element.attr({
      x: pad + p.x,
      y: pad + p.y,
      width: config.grid.width * Math.abs(days) - pad * 2
    })
    return this._element
  }

  _getDrawingStyle() {
    return this._canvas.config.bar.default
  }

  _getSelectedStyle() {
    return this._canvas.config.bar.selected
  }

  _getLayerToAppend() {
    return this._canvas.frontLayer
  }

  _setEventHandlers() {
    this._element.hover(this._onHoverIn, this._onHoverOut, this, this)
    this._element.drag(
      this._onDragMove,
      this._onDragStart,
      this._onDragEnd,
      this,
      this,
      this
    )
  }

  _releaseEventHandlers() {
    this._element.unhover(this._onHoverIn, this._onHoverOut)
    this._element.drag()
  }

  _onHoverIn(e, x, y) {
    this._element.node.style.cursor = this._lock ? 'not-allowed' : 'move'
  }
  _onHoverOut(e, x, y) {
    this._element.node.style.cursor = 'auto'
  }
  _onClick() {
    this._canvas.selectedBar = this
  }
  _onDragStart(x, y, e) {
    e.stopPropagation()
    if (this._lock) {
      return
    }
    this._dragOrigin = {
      date: this._dateRange.start.clone(),
      rowIdx: this._canvas.rowIdxFromId(this._rowId),
      tripped: false
    }
  }
  _onDragMove(dx, dy, x, y, e) {
    e.stopPropagation()
    if (this._lock) {
      return
    }
    const origin = this._dragOrigin
    const config = this._canvas.config
    const daysStart2Current = Util.halfRound(dx / config.grid.width)
    const daysStart2Prev = this._dateRange.start.diffDays(origin.date)
    const daysPrev2Current = daysStart2Current - daysStart2Prev
    const shiftedRange = this._dateRange.clone().shift(daysPrev2Current)
    const shiftedRowIdx = origin.rowIdx + Math.round(dy / config.grid.height)
    const shiftedRowId = this._canvas.rowIdFromIdx(shiftedRowIdx)
    if (!this._canvas.checkCollision(shiftedRowId, shiftedRange, this)) {
      return
    }
    this._dateRange = shiftedRange
    this._rowId = shiftedRowId
    this.render()
    if (origin.tripped) {
      return
    }
    if (
      origin.rowIdx !== shiftedRowIdx ||
      !origin.date.equals(shiftedRange.start)
    ) {
      origin.tripped = true
    }
  }
  _onDragEnd(e) {
    e.stopPropagation()
    if (this._lock) {
      return
    }
    if (!this._dragOrigin.tripped) {
      this._onClick()
    }
    this._dragOrigin = null
    this.raiseChange()
  }

  raiseChange() {
    // if (!this._canvas) {
    //   return
    // }
    // this._canvas.notifyChange(record)
  }

  bindTo(canvas) {
    if (this._canvas) {
      return false
    }
    this._canvas = canvas
    this.raiseChange()
  }
  releaseFromCanvas() {
    if (this._element) {
      // remove event listener
      this._releaseEventHandlers()
      // remove self from canvas
      this._element.remove()
      this._element = null
    }
    // this._canvas.removeBar(this.id)
    this._canvas = null
    return true
  }

  select() {
    // change style
    this._setStyle(this._getSelectedStyle())
    // show drag handle
  }

  unselect() {
    // restore style
    this._setStyle(this._getDrawingStyle())
    // hide drag handle
  }

  toString() {
    return `${this._rowId}:${this._dateRange.toString()}`
  }
}
