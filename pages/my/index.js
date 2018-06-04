Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: "未登录"
    },
    bType: 'primary',
    actionText: '登录',
    lock: false,
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        wx.hideLoading();
        this.setData({
          userInfo: {
            avatarUrl: res.data.userInfo.avatarUrl,
            nickName: res.data.userInfo.nickName
          },
          bType: res.data.bType,
          actionText: res.data.actionText,
          lock: true
        })
      },
    })
  },
  bindAction: function(e) {
    this.data.lock = !this.data.lock;
    if(this.data.lock) {
      wx.showLoading({
        title: '正在登录'
      })
      wx.login({
        success: (res) => {
          wx.hideLoading();
          wx.getUserInfo({
            withCredentials: false,
            success: (res) => {
              this.setData({
                userInfo: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName
                },
                bType: "warn",
                actionText: "退出登录",
              });
              wx.setStorage({
                key: 'userInfo',
                data: {
                  userInfo: {
                    avatarUrl: res.userInfo.avatarUrl,
                    nickName: res.userInfo.nickName
                  },
                  bType: "warn",
                  actionText: "退出登录",
                },
                success: (res) => {
                  console.log('存储成功')
                }
              })
            },
          })
        }
      })
    }else {
      wx.showModal({
        title: '确认退出？',
        content: '退出后将不能使用ofo',
        success: (res) => {
          if(res.confirm) {
            console.log('confirm')
            wx.removeStorageSync('userInfo');
            this.setData({
              userInfo: {
                avatarUrl: "",
                nickName: "未登录"
              },
              bType: 'primary',
              actionText: '登录'
            })
          }else {
            console.log('cancel');
            this.setData({
              lock: true
            })
          }
        }
      })
    }
  },
  movetoWallet: function() {
    wx.navigateTo({
      url: '../wallet/index',
    })
  }
})