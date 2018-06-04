Page({
  data: {
    time: 9,
  },
  onLoad: function(options) {
    this.setData({
      password: options.password
    })

    let time  = 9;
    this.timer = setInterval(() => {
      this.setData({
        time: time --
      })
      if(time === 0) {
        clearInterval(this.timer);
        wx.redirectTo({
          url: '../biling/index?number=' + options.number,
        })
      }
    }, 1000)
  },
  moveToWarn() {
    clearInterval(this.timer);
    wx.redirectTo({
      url: '../index/index',
    })
  }
})