module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: "booking-calendar.js",
    library: "BookingCalendar",
    libraryTarget: "umd"
  },
  devtool: 'inline-source-map'
};