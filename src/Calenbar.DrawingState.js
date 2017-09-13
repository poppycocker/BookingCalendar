import moment from 'moment'
import Util from './Util.js'
import Bar from './Calenbar.Bar.js'

export default class DrawingState {

  static get IDLE() {
    return 0x0
  }
  static get PROCESSING() {
    return 0x1
  }
  static get RENDERED() {
    return 0x2
  }

  constructor(canvas) {
    this._canvas = canvas
    this._state = DrawingState.IDLE
    this._startPos = null
    this._currentPos = null
    this._bar = null
  }

  get now() {
    return this._state
  }

  get bar() {
    return this._bar
  }

  begin(startPos) {
    this._startPos = startPos
    this._currentPos = startPos
    this._bar = null
    this._state = DrawingState.PROCESSING
  }

  update(currentPos) {
    // no need to update
    if (this._currentPos.date.equals(currentPos.date)) {
      return false
    }
    if (this._startPos.date.equals(currentPos.date)) {
      return false
    }
    this._currentPos = currentPos
    if (!this._bar) {
      this._bar = new Bar(this._startPos.rowId, this._startPos.date, this._currentPos.date)
      this._bar.canvas = this._canvas
      this._bar.render()
      this._state = DrawingState.RENDERED
    }
    const isReverse = this._currentPos.date.getTime() < this._startPos.date.getTime()
    this._bar.startDate = isReverse ? this._currentPos.date : this._startPos.date
    this._bar.finishDate = isReverse ? this._startPos.date : this._currentPos.date

    return true
  }

  finish() {
    this._startPos = null
    this._currentPos = null
    this._bar = null
    this._state = DrawingState.IDLE
  }
}
