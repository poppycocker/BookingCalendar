import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
import Fragment from './Calenbar.Fragment.js'
import Util from './Util.js'

export default class RowHeaders extends Fragment {
  constructor(outerContainer, config, rows) {
    super(outerContainer, config)
    this._rows = rows
    this._setUp()
    this._render()
  }

  _setUp() {
    const style = this._containerDom.style
    const config = this._config
    const scrollBarWidth = Util.getScrollbarWidth()
    const rowNum = Object.keys(this._rows).length
    style.overflow = 'hidden'
    style.width = config.row_head.width + 'px'
    style.height = this._outerContainer.clientHeight - scrollBarWidth + 'px'
    style.gridArea = '2 / 1 / 2 / 2'

    this._snapElement.attr({
      width: config.row_head.width + 'px',
      height: config.grid.height * rowNum + 'px'
    })
  }

  _render() {
    const config = this._config
    const rows = this._rows
    const svg = this._snapElement
    Object.keys(rows).forEach(function(id, i) {
      const name = rows[id]
      const pad = config.row_head.padding
      const x = pad
      const y = pad + config.grid.height * i
      const w = config.row_head.width - pad * 2
      const h = config.grid.height - pad * 2
      const r = config.row_head.round
      svg.rect(x, y, w, h, r).attr({
        fill: config.row_head.fill
      })
      svg.text(x + w / 2, y + h / 2, name)
    })
  }
}
