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
    /**
     * flag for fireable or not
     * @private
     * @type {boolean}
     */
    this._active = true
  }

  /**
   * add listener function.
   * @param {Function} listener(args...) listener function to add
   * @param {Object} [context=null] context for listener
   * @return {EventDispatcher} this
   */
  addListener(listener, context) {
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
  removeListener(listener) {
    for (let i = 0; i < this._listeners.length; i++) {
      if (this._listeners[i].func === listener) {
        this._listeners.splice(i--, 1)
      }
    }
    return this
  }

  /**
   * clear all listeners.
   * @return {EventDispatcher} this
   */
  clearListener() {
    this._listeners = []
    return this
  }

  /**
   * check existance of specific listener.
   * @param {Function} listener(args...) listener function to check existance
   * @return {boolean} exists or not
   */
  hasListener(listener) {
    for (let i = 0; i < this._listeners.length; i++) {
      if (this._listeners[i].func === listener) {
        return true
      }
    }
    return false
  }

  /**
   * returns number of registered listeners
   * @return {Number} number of registered listeners
   */
  count() {
    return this._listeners.length
  }

  /**
   * calls all listener functions with given arguments.
   * @param {...*} var_args
   * @return {EventDispatcher} this
   */
  dispatch() {
    if (!this._active) {
      return
    }
    const args = arguments
    this._listeners.forEach(function(o) {
      o.func.apply(o.context, args)
    })
    return this
  }

  /**
   * set dispatch() method available to fire.
   * @return {EventDispatcher} this
   */
  activate() {
    this._active = true
  }

  /**
   * set dispatch() method unavailable to fire.
   * @return {EventDispatcher} this
   */
  mute() {
    this._active = false
  }

  /**
   * returns dispatchable or not
   * @return {boolean} dispatchable or not
   */
  isActive() {
    return this._active
  }
}
