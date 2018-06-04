Page({
  data: {
    inputValue: 0,
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '充值',
    })
  },
  bindInput: function(res) {
    this.setData({
      inputValue: res.detail.value
    })
  },
  charge: function() {
    if(parseInt(this.data.inputValue) <= 0 || isNaN(this.data.inputValue)) {
      wx.showModal({
        title: '警告',
        content: '还得倒贴钱给你呗',
        showCancel: false,
        confirmText: '不不不不'
      })
    }else {
      wx.redirectTo({
        url: '../wallet/index',
        success: (res) => {
          wx.showToast({
            title: "充值成功",
            icon: "success",
            duration: 2000
          })
        }
      })
    }
  },
  onUnload: function() {
    wx.getStorage({
      key: 'overage',
      success: (res) => {
        wx.setStorage({
          key: 'overage',
          data: {
            overage: parseInt(this.data.inputValue) + parseInt(res.data.overage)
          },
        })
      },
      fail: (res) => {
        wx.setStorage({
          key: 'overage',
          data: {
            overage: parseInt(this.data.inputValue)
          },
        })
      }
    })
  },
})