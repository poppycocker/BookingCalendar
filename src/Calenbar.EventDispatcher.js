/**
 * @class provides event dispatcher for multiple listeners.
 * @constructor
 */
export default class EventDispatcher {
  constructor() {
    /**
     * array of listeners
     * @private
     * @type {array}
     */
    this._listeners = []
  }

  /**
   * add listener function.
   * @param {Function} listener(args...) listener function to add
   * @param {Object} [context=null] context for listener
   * @return {EventDispatcher} this
   */
  on(listener, context) {
    this._listeners.push({
      func: listener,
      context: context || null
    })
    return this
  }

  /**
   * remove the listener function.
   * @param {Function} listener(args...) listener function to remove.
   * @return {EventDispatcher} this
   */
  un(listener) {
    for (let i = 0; i < this._listeners.length; i++) {
      if (this._listeners[i].func === listener) {
        this._listeners.splice(i--, 1)
      }
    }
    return this
  }

  /**
   * calls all listener functions with given arguments.
   * @param {array} arguments for each listeners
   * @return {EventDispatcher} this
   */
  dispatch(args) {
    this._listeners.forEach(function(o) {
      o.func.apply(o.context, args)
    })
    return this
  }
}
