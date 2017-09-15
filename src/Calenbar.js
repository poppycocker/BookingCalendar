import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js'
import Util from './Util.js'
import Canvas from './Calenbar.Canvas'
import TopLeftBlank from './Calenbar.TopLeftBlank.js'
import RowHeaders from './Calenbar.RowHeaders.js'
import ColCalendar from './Calenbar.ColCalendar.js'
import Bar from './Calenbar.Bar.js'
import DateProcessor from './Calenbar.DateProcessor.js'

var defaultConfig = {
  center_date: new DateProcessor(new Date()),
  date_range: 60,
  bar: {
    padding: 4,
    round: 5,
    fill: '#1e88e5',
    stroke: '#105189',
    strokeWidth: 2
  },
  ghost: {
    padding: 2,
    round: 5,
    stroke: '#1e88e5',
    strokeWidth: 2
  },
  row_head: {
    width: 120,
    padding: 4,
    round: 5,
    fill: '#bada55'
  },
  col_head: {
    height: 80,
    font_size: 12
  },
  grid: {
    width: 50,
    height: 80
  }
}

export default class Calenbar {
  static get defaultConfig() {
    return Object.assign({}, defaultConfig)
  }

  /**
   * Constructs the object.
   *
   * @param {string} id - id of container element
   * @param {object} rows - array of row object
   * @param {array<Bars>} [bars] - array of Bar object
   * @param {object} config - configs
   */
  constructor(id, rows, bars, config) {
    this._initializeConfig(config)
    /**
     * bars
     * @type {array<Bar>}
     */
    this._bars = bars || []
    /**
     * rows
     * @type {object}
     */
    this._rows = rows
    /**
     * current center position as date.
     * initial value is today.
     * @type {Date}
     */
    this._currentCenter = new Date(this._config.center_date)

    this._initializeCanvas(id)

    this._bars.forEach(bar => this.putBar(bar))

    // this.render()
  }
  _initializeConfig(config) {
    this._config = config || Calenbar.defaultConfig
    // to avoid
    if (this._config.ghost.fill) {
      console.log('config.ghost.fill will be ignored (always "none" is set).')
    }
    this._config.ghost.fill = 'none'
  }
  _initializeCanvas(id) {
    const config = this._config
    const outerContainer = document.getElementById(id)
    const container = document.createElement('div')
    container.style.display = 'grid'
    container.style.gridTemplateRows = config.col_head.height + 'px' + ' 1fr'
    container.style.gridTemplateColumns = config.row_head.width + 'px' + ' 1fr'
    container.style.width = '100%'
    container.style.height = '100%'
    outerContainer.appendChild(container)

    const topLeftBlank = new TopLeftBlank(container, config)
    const colCalendar = new ColCalendar(container, config)
    const rowHeaders = new RowHeaders(container, config, this._rows)
    const canvas = new Canvas(
      container,
      config,
      this._rows,
      this.onCollisionCheckRequired.bind(this)
    )
    canvas.on('bar_added', this.onBarAdded, this)
    this._canvas = canvas

    // sync scroll
    canvas.containerDom.addEventListener('scroll', function(e) {
      colCalendar.containerDom.scrollLeft = e.target.scrollLeft
      rowHeaders.containerDom.scrollTop = e.target.scrollTop
    })

    // initial scroll position: today
    canvas.containerDom.scrollLeft =
      canvas.snapElement.attr('width').replace('px', '') / 2 -
      canvas.containerDom.clientWidth / 2 +
      config.grid.width / 2
  }

  onBarAdded(bar) {
    this._bars.push(bar)
  }

  onCollisionCheckRequired(rowId, dateRange, self) {
    return !this.doesIntersectWith(rowId, dateRange, self)
  }

  get bars() {
    // shallow copy
    return [].concat(this._bars)
  }
  get rows() {
    // copy
    return Object.assign({}, this._rows)
  }
  get center() {}
  /**
   * set given date center of view
   * @param      {Date}  date
   */
  set center(date) {}
  /**
   * Puts a bar.
   *
   * @param      {Calenbar.Bar}  bar  The bar
   * @return     {boolean} success / failed
   * @fires      put
   */
  putBar(bar) {
    if (this.canPutBar(bar)) {
      return false
    }
    bar.canvas = this._canvas
    bar.render()
    this._bars.push(bar)
    return true
  }
  /**
   * Removes a bar.
   *
   * @param      {string}  id  bar id to remove
   * @return     {boolean} success / failed
   * @fires      remove
   */
  removeBar(id) {
    const idx = this._bars.findIndex(bar => bar.id === id)
    if (idx === -1) {
      return false
    }
    this._bars[idx].release()
    this._bars.splice(idx, 1)
    return true
  }
  findBar(id) {
    if (!id) {
      return null
    }
    return this._bars.find(bar => bar.id === id)
  }
  canPutBar(bar) {
    // check: is row id valid
    if (!this._rows[bar.rowId]) {
      return false
    }
    // check: id uniqueness (if effective one is set)
    if (Util.isEffectiveId(bar.id) ? !!this.findBar(bar.id) : true) {
      return false
    }
    // check: already exists
    if (this._bars.some(el => el === bar)) {
      return false
    }
    // check: date range intersection
    return !this.doesIntersectWith(bar.rowId, bar.dateRange)
  }
  doesIntersectWith(rowId, dateRange, self) {
    return this._bars
      .filter(bar => bar.rowId === rowId)
      .filter(bar => (self ? bar !== self : true))
      .some(bar => dateRange.doesIntersectWith(bar.dateRange))
  }
}

Calenbar.Bar = Bar
Calenbar.Date = DateProcessor
