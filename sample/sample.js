document.addEventListener("DOMContentLoaded", function() {
  let rows = {
    AAA: 'aaa',
    BBB: 'bbb',
    CCC: 'ccc',
    DDD: 'ddd',
    EEE: 'eee'
  }
  let d = function(yyyymmdd) {
    return new Date(yyyymmdd)
  }
  let opts = {
    records: [
      new BookingCalendar.Record('01', 'AAA', d('2017/5/20'), d('2017/5/22')),
      new BookingCalendar.Record('02', 'AAA', d('2017/5/25'), d('2017/5/27')),
      new BookingCalendar.Record('03', 'BBB', d('2017/5/25'), d('2017/5/26')),
      new BookingCalendar.Record('04', 'CCC', d('2017/5/25'), d('2017/5/25')),
      new BookingCalendar.Record('05', 'EEE', d('2017/5/15'), d('2017/6/1'))
    ]
  }
  window.bc = new BookingCalendar('cal', rows, opts)

});
