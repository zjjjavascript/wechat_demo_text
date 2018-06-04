Page({
  data: {
    hours: 0,
    minuters: 0,
    seconds: 0,
    billing: '正在计费'
  },
  onLoad:function(options) {
    this.setData({
      number: options.number,
      timer: this.timer
    })

    let s =0,
        m = 0, 
        h = 0;
    
    this.timer = setInterval(() => {
      this.setData({
        seconds: s++,
      })
      if(s === 60) {
        m++;
        s = 0;
        setTimeout(() => {
          this.setData({
            minuters: m,
          })
        })
        if(m == 60) {
          m = 0;
          h++;
          setTimeout(()=>{
            this.setData({
              hours: h,
            })
          },1000)
        }
      }
    },1000)
  },
  endRide: function() {
    clearInterval(this.timer);
    this.timer = '';
    this.setData({
      billing: '本次骑行耗时',
      disabled: true,
    })
  },
  moveToIndex: function() {
    if(this.timer === '') {
      wx.redirectTo({
        url: '../index/index',
      })
    }else {
      wx.navigateTo({
        url: '../index/index?timer=' + this.timer,
      })
    }
  }
})