import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
import Fragment from './Calenbar.Fragment.js'
import Bar from './Calenbar.Bar.js'

export default class Canvas extends Fragment {
  constructor(outerContainer, config, rows, collisionCheckCallback) {
    super(outerContainer, config)
    this._rows = rows
    this._collisionCheckCallback = collisionCheckCallback
    this._setUp()
    this._render()
    this._setEventHandler()

    this._currentBar = null
    this._startPos = null
    this._ghost = null
  }

  _setUp() {
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
  }

  _render() {
    const config = this._config
    let svg = this._snapElement
    let path = 'M %w 0 L 0 0 0 %h'
      .replace('%w', config.grid.width)
      .replace('%h', config.grid.height)
    let p = svg.path(path).attr({
      fill: 'none',
      stroke: '#ccc',
      strokeWidth: 3
    }).pattern(0, 0, config.grid.width, config.grid.height)
    let board = svg.rect(0, 0, svg.attr('width'), svg.attr('height'))
    board.attr({
      fill: p
    })
  }

  _setEventHandler() {
    // this._snapElement.hover(this._onHoverIn, this._onHoverOut, this, this)
    // this._snapElement.mousemove(this._onMouseMove.bind(this))
    this._snapElement.drag(this._onDragMove, this._onDragStart, this._onDragEnd, this, this, this)
  }

  _onDragStart(x, y, e) {
    e.stopPropagation()
    this._startPos = this.screenPointToGridPos(e.offsetX, e.offsetY)
    this._currentBar = new Bar(this._startPos.rowId, this._startPos.date, this._startPos.date)

    if (!this._collisionCheckCallback(this._currentBar)) {
      this._startPos = null
      this._currentBar = null
      return
    }

    this._currentBar.canvas = this
    this._currentBar.render()
  }

  _onDragMove(dx, dy, x, y, e) {
    e.stopPropagation()
    let pos = this.screenPointToGridPos(e.offsetX, e.offsetY)
    if (!this._startPos) {
      return
    }
    // on dragend
    if (e.clientX === 0 && e.clientY === 0) {
      return
    }
    // 反転ケース考慮
    let isReverse = pos.date.getTime() < this._startPos.date.getTime()
    this._currentBar.startDate = isReverse ? pos.date : this._startPos.date
    this._currentBar.finishDate = isReverse ? this._startPos.date : pos.date

    if (!this._collisionCheckCallback(this._currentBar)) {
      return
    }
    this._currentBar.render()
  }

  _onDragEnd(e) {
    e.stopPropagation()
    this.getEventDispatcher('bar_added').dispatch(this._currentBar)
    this._startPos = null
    this._currentBar = null
  }

  _onHoverIn(e, x, y) {
    if (this._ghost) {
      return
    }
    // create ghost
    e.stopPropagation()
    let startPos = this.screenPointToGridPos(e.offsetX, e.offsetY)
    this._ghost = new Bar(startPos.rowId, startPos.date, startPos.date)

    if (!this._collisionCheckCallback(this._ghost)) {
      this._ghost = null
      return
    }

    this._ghost.canvas = this
    this._ghost.render()
  }

  _onHoverOut(e, x, y) {
    if (!this._ghost) {
      return
    }
    // remove ghost
    this._ghost.releaseFromCanvas()
    this._ghost = null
  }

  _onMouseMove(e) {
    e.stopPropagation()
    if (!this._ghost) {
      return
    }
    let pos = this.screenPointToGridPos(e.offsetX, e.offsetY)
    this._ghost.startDate = pos.date
    this._ghost.finishDate = pos.date
    this._ghost.rowId = pos.rowId
    this._ghost.render()
  }

  checkCollision(bar) {
    return this._collisionCheckCallback(bar)
  }

  _getStartDate() {
    const config = this._config
    let date = new Date(config.center_date)
    date.setDate(date.getDate() - config.date_range / 2)
    date.setHours(0, 0, 0, 0)
    return date
  }

  // returns row idx & date
  screenPointToGridPos(x, y) {
    const config = this._config
    let rowIdx = Math.floor(y / config.grid.height)
    let rowId = this.rowIdFromIdx(rowIdx)
    let date = this._getStartDate(config)
    date.setDate(date.getDate() + Math.floor(x / config.grid.width))
    return {
      rowId,
      date
    }
  }

  gridPosToScreenPoint(pos) {
    const config = this._config
    let startDate = this._getStartDate(config)
    let days = Math.floor((pos.date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
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
