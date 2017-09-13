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
    new Calenbar.Bar('AAA', d(2017, 6, 20, 0), d(2017, 6, 22, 0), '01'),
    new Calenbar.Bar('AAA', d(2017, 6, 25, 1), d(2017, 6, 27, 1), '02'),
    new Calenbar.Bar('BBB', d(2017, 6, 25, 0), d(2017, 6, 26, 0), '03'),
    new Calenbar.Bar('CCC', d(2017, 6, 25, 1), d(2017, 6, 25, 0), '04'),
    new Calenbar.Bar('EEE', d(2017, 6, 28, 0), d(2017, 7, 16, 1), '05')
  ]
  const config = {
    center_date: d(2017, 7, 1, 0),
    date_range: 60,
    bar: {
      padding: 4,
      round: 5,
      fill: '#1e88e5'
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

  window.cb = new Calenbar('cal', rows, bars, config)
})
