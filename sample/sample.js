document.addEventListener('DOMContentLoaded', function() {
  let rows = {
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
  let d = function(yyyymmdd) {
    return new Date(yyyymmdd)
  }
  let bars = [
    new Calenbar.Bar('AAA', d('2017/6/20'), d('2017/6/22'), '01'),
    new Calenbar.Bar('AAA', d('2017/6/25'), d('2017/6/27'), '02'),
    new Calenbar.Bar('BBB', d('2017/6/25'), d('2017/6/26'), '03'),
    new Calenbar.Bar('CCC', d('2017/6/25'), d('2017/6/25'), '04'),
    new Calenbar.Bar('EEE', d('2017/6/28'), d('2017/7/16'), '05')
  ]
  let config = null

  window.cb = new Calenbar('cal', rows, bars, config)
})
