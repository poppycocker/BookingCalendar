import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
import Observable from './Calenbar.Observable.js'

export default class Fragment extends Observable {
  constructor(outerContainer, config) {
    super()
    this._outerContainer = outerContainer
    this._config = config
    this._containerDom = document.createElement('div')
    this._outerContainer.appendChild(this._containerDom)
    this._snapElement = Snap().appendTo(this._containerDom)
  }

  _setUp() {
    // abstract method
  }

  _render() {
    // abstract method
  }

  get containerDom() {
    return this._containerDom
  }

  get snapElement() {
    return this._snapElement
  }

  get config() {
    return this._config
  }
}
