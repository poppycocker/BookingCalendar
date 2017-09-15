import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
import Util from './Util.js'
import Fragment from './Calenbar.Fragment.js'
import DateProcessor from './Calenbar.DateProcessor.js'
import DrawingState from './Calenbar.DrawingState.js'
import GhostState from './Calenbar.GhostState.js'

export default class Canvas extends Fragment {
  constructor(outerContainer, config, rows, collisionCheckCallback) {
    super(outerContainer, config)
    this._rows = rows
    this._collisionCheckCallback = collisionCheckCallback

    this._backLayer = null
    this._frontLayer = null
    this._setUpSvg()
    this._setEventHandler()

    this._startDate = new DateProcessor(config.center_date)
    this._startDate.addDate(config.date_range / 2 * -1)

    this._drawing = new DrawingState(this)
    this._ghost = new GhostState(this)
  }

  get frontLayer() {
    return this._frontLayer
  }

  get backLayer() {
    return this._backLayer
  }

  _setUpSvg() {
    let style = this._containerDom.style
    const config = this._config
    const rowNum = Object.keys(this._rows).length
    style.overflow = 'scroll'
    style.width = (this._outerContainer.clientWidth - config.row_head.width) + 'px'
    style.height = (this._outerContainer.clientHeight) + 'px'
    style.gridArea = '2 / 2 / 2 / 2'

    this._snapElement.attr({
      width: config.grid.width * config.date_range + 'px',
      height: (config.grid.height * rowNum) + 'px'
    })

    this._backLayer = this._snapElement.svg()
    const path = 'M %w 0 L 0 0 0 %h'
      .replace('%w', config.grid.width)
      .replace('%h', config.grid.height)
    const p = this._backLayer.path(path).attr({
      fill: 'none',
      stroke: '#ccc',
      strokeWidth: 3
    }).pattern(0, 0, config.grid.width, config.grid.height)
    this._backLayer.rect(0, 0, this._snapElement.attr('width'), this._snapElement.attr('height')).attr({
      fill: 'none'
    })

    this._frontLayer = this._snapElement.svg()
    this._frontLayer.rect(0, 0, this._snapElement.attr('width'), this._snapElement.attr('height')).attr({
      fill: p
    })
  }

  _setEventHandler() {
    this._frontLayer.drag(this._onDragMove, this._onDragStart, this._onDragEnd, this, this, this)
    this._frontLayer.mousemove(this._onMouseMove.bind(this))
  }

  _onDragStart(x, y, e) {
    e.stopPropagation()
    if (this._drawing.now > DrawingState.IDLE) {
      return
    }
    this._ghost.hide()
    const pos = this.screenPointToGridPos(e.offsetX, e.offsetY)
    this._drawing.begin(pos)
  }

  _onDragMove(dx, dy, x, y, e) {
    e.stopPropagation()
    this._ghost.hide()
    let pos = this.screenPointToGridPos(e.offsetX, e.offsetY)
    if (this._drawing.now < DrawingState.PROCESSING) {
      return
    }
    // on dragend
    if (e.clientX === 0 && e.clientY === 0) {
      return
    }
    if (!this._drawing.update(pos)) {
      return
    }
    if (!this._collisionCheckCallback(this._drawing.bar)) {
      return
    }
    this._drawing.bar.render()
  }

  _onDragEnd(e) {
    e.stopPropagation()
    if (this._drawing.now < DrawingState.RENDERED) {
      this._drawing.finish()
      return
    }
    this.getEventDispatcher('bar_added').dispatch(this._drawing.bar)
    this._drawing.finish()
    const pos = this.screenPointToGridPos(e.offsetX, e.offsetY)
    this._ghost.show(pos)
  }

  _onMouseMove(e) {
    // hide ghost while dragging
    if (e.buttons > 0) {
      this._ghost.hide()
      return
    }
    const pos = this.screenPointToGridPos(e.offsetX, e.offsetY)
    this._ghost.show(pos)
  }

  checkCollision(bar) {
    return this._collisionCheckCallback(bar)
  }

  // returns row idx & date
  screenPointToGridPos(x, y) {
    const config = this._config
    let rowIdx = Math.floor(y / config.grid.height)
    let rowId = this.rowIdFromIdx(rowIdx)
    let date = this._startDate.clone()
    const shift = config.grid.width / 4
    date.addDate(Util.halfRound((x - shift) / config.grid.width))
    return {
      rowId,
      date
    }
  }

  gridPosToScreenPoint(pos) {
    const config = this._config
    let days = pos.date.diffDays(this._startDate)
    return {
      x: config.grid.width * days,
      y: config.grid.height * this.rowIdxFromId(pos.rowId)
    }
  }

  rowIdFromIdx(idx) {
    return Object.keys(this._rows)[idx]
  }

  rowIdxFromId(id) {
    return Object.keys(this._rows).indexOf(id)
  }
}
