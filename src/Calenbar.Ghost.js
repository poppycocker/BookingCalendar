import Bar from './Calenbar.Bar.js'

export default class Ghost extends Bar {
  _getDrawingStyle() {
    return this.canvas.config.ghost
  }

  _getLayerToAppend() {
    return this._canvas.backLayer
  }

  _setEventHandlers() {}

  _releaseEventHandlers() {}
}
