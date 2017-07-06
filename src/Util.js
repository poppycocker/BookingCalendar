export default class Util {
  // https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
  static getScrollbarWidth() {
    let outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.width = '100px'
    outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps

    document.body.appendChild(outer)

    let widthNoScroll = outer.offsetWidth
    // force scrollbars
    outer.style.overflow = 'scroll'

    // add innerdiv
    let inner = document.createElement('div')
    inner.style.width = '100%'
    outer.appendChild(inner)

    let widthWithScroll = inner.offsetWidth

    // remove divs
    outer.parentNode.removeChild(outer)

    return widthNoScroll - widthWithScroll
  }
}
