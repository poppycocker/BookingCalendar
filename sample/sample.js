document.addEventListener('DOMContentLoaded', function() {
  const rows = {
    AAA: 'aaa',
    BBB: 'bbb',
    CCC: 'ccc',
    DDD: 'ddd',
    EEE: 'eee',
    FFF: 'fff',
    GGG: 'ggg',
    HHH: 'hhh',
    III: 'iii'
  }
  const d = function(y, m, d, half) {
    return new Calenbar.Date(y, m, d, half)
  }
  const bars = [
    new Calenbar.Bar('AAA', d(2017, 6, 20, 0), d(2017, 6, 22, 0), {
      id: '01',
      lock: false
    }),
    new Calenbar.Bar('AAA', d(2017, 6, 25, 1), d(2017, 6, 27, 1), {
      id: '02',
      lock: true
    }),
    new Calenbar.Bar('BBB', d(2017, 6, 25, 0), d(2017, 6, 26, 0), {
      id: '03'
    }),
    new Calenbar.Bar('CCC', d(2017, 6, 25, 1), d(2017, 6, 25, 0), {
      id: '04'
    }),
    new Calenbar.Bar('EEE', d(2017, 6, 28, 0), d(2017, 7, 16, 1), {
      id: '05',
      lock: true
    })
  ]
  const config = Calenbar.defaultConfig
  config.center_date = d(2017, 7, 1, 0)

  const cb = new Calenbar('cal', rows, bars, config)
  cb.on('bar_added', (bar) => {
    const msg = bar ? `added: ${bar.toString()}` : 'null'
    console.log(msg)
  })
  cb.on('bar_selected', (bar) => {
    const msg = bar ? `selected: ${bar.toString()}` : 'released'
    console.log(msg)
  })

  window.cb = cb
})
