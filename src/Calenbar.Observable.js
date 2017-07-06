import EventDispatcher from './Calenbar.EventDispatcher.js'

/**
 * @classdesc
 * provides event subscription functions.
 * @constructor
 * @api stable
 */
export default class Observable {
  constructor() {
    /**
     * map for event dispatchers
     * @type {object}
     * @private
     */
    this._dispatchers = {}
  }

  /**
   * add an event listener.
   * @param {string} type type(name) of event
   * @param {function} listener listener function
   * @param {Object} [context=null] context for listener
   * @return {Observable} this
   * @api stable
   */
  addListener(type, listener, context) {
    context = context || null
    this.getEventDispatcher(type).addListener(listener, context)
    return this
  }

  /**
   * remove an event listener.
   * @param {string} type type(name) of event
   * @param {function} listener listener function to remove.
   * @return {Observable} this
   * @api stable
   */
  removeListener(type, listener) {
    this.getEventDispatcher(type).removeListener(listener)
    return this
  }

  /**
   * clear listeners of specific event type.
   * @param {string} type type(name) of event
   * @return {Observable} this
   * @api stable
   */
  clearListener(type) {
    this.getEventDispatcher(type).clearListener()
    return this
  }

  /**
   * clear all listeners
   * @return {Observable} this
   * @api stable
   */
  clearAllListener() {
    Object.keys(this._dispatchers).forEach(type => this.clearListener(type))
    return this
  }

  /**
   * check existance of specific listener.
   * @param {string} type type(name) of event
   * @param {function} listener listener function to check existance
   * @return {boolean} exists or not
   * @api stable
   */
  hasListener(type, listener) {
    let dispatcher = this.getEventDispatcher(type)
    if (!dispatcher) {
      return false
    }
    return dispatcher.hasListener(listener)
  }

  /**
   * get the event dispatcher object for specific event type.
   * @private
   * @param {string} type type(name) of event
   * @return {EventDispatcher?} event dispatcher object. if not found, returns null.
   */
  getEventDispatcher(type) {
    if (!this._dispatchers[type]) {
      this._dispatchers[type] = new EventDispatcher()
    }
    return (this._dispatchers[type] || null)
  }
}
