import Ghost from './Calenbar.Ghost.js'

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

  get bar() {
    return this._ghost
  }

  show(pos) {
    if (!this._ghost) {
      this._ghost = new Ghost(pos.rowId, pos.date, pos.date)
    }
    if (this._ghost.startDate.equals(pos.date) && this._ghost.rowId === pos.rowId) {
      return false
    }
    this._ghost.canvas = this._canvas
    this._ghost.rowId = pos.rowId
    this._ghost.startDate = pos.date
    this._ghost.finishDate = this._ghost.startDate.clone()
    this._ghost.finishDate.addDate(0.5)
    if (!this._canvas.checkCollision(this._ghost)) {
      this.hide()
      return false
    }
    this._state = GhostState.VISIBLE
    this._ghost.render()
    return true
  }

  hide() {
    if (this._ghost) {
      this._ghost.releaseFromCanvas()
    }
    this._state = GhostState.HIDDEN
  }
}
