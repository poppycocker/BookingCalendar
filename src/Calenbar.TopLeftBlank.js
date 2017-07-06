import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
import Fragment from './Calenbar.Fragment.js'

export default class TopLeftBlank extends Fragment {

  constructor(outerContainer, config) {
    super(outerContainer, config)
    this._setUp()
    this._render()
  }

  _setUp() {
    const config = this._config
    this._containerDom.style.width = config.row_head.width + 'px'
    this._containerDom.style.gridArea = '1 / 1 / 2 / 2'
  }
}