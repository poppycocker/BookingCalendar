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
  on(type, listener, context) {
    context = context || null
    this._getEventDispatcher(type).on(listener, context)
    return this
  }

  /**
   * remove an event listener.
   * @param {string} type type(name) of event
   * @param {function} listener listener function to remove.
   * @return {Observable} this
   * @api stable
   */
  un(type, listener) {
    this._getEventDispatcher(type).un(listener)
    return this
  }

  /**
   * dispatch event of specific type.
   * @param {string} type type(name) of event
   * @return {Observable} this
   * @api stable
   */
  dispatch(type, ...args) {
    this._getEventDispatcher(type).dispatch(args)
    return this
  }

  /**
   * get the event dispatcher object for specific event type.
   * @private
   * @param {string} type type(name) of event
   * @return {EventDispatcher?} event dispatcher object
   */
  _getEventDispatcher(type) {
    if (!this._dispatchers[type]) {
      this._dispatchers[type] = new EventDispatcher()
    }
    return this._dispatchers[type]
  }
}
