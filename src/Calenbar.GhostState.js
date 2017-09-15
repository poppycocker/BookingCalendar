import Ghost from './Calenbar.Ghost.js'
import DateRange from './Calenbar.DateRange.js'

export default class GhostState {
  static get HIDDEN() {
    return 0x0
  }
  static get VISIBLE() {
    return 0x1
  }

  constructor(canvas) {
    this._canvas = canvas
    this._state = GhostState.HIDDEN
    this._ghost = null
  }

  get now() {
    return this._state
  }

  show(pos) {
    if (!this._ghost) {
      this._ghost = new Ghost(pos.rowId, pos.date, pos.date)
    }
    if (
      this._ghost.dateRange.start.equals(pos.date) &&
      this._ghost.rowId === pos.rowId
    ) {
      return false
    }
    const range = new DateRange(pos.date, pos.date.clone().shift(0.5))
    if (!this._canvas.checkCollision(pos.rowId, range)) {
      this.hide()
      return false
    }
    this._ghost.canvas = this._canvas
    this._ghost.rowId = pos.rowId
    this._ghost.dateRange = range
    this._ghost.render()
    this._state = GhostState.VISIBLE
    return true
  }

  hide() {
    if (this._ghost) {
      this._ghost.releaseFromCanvas()
    }
    this._state = GhostState.HIDDEN
  }
}
