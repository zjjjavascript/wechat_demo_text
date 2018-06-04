Page({
  data: {
    picUrls: [],
    inputValue: {
      num: 0,
      desc: '',
    },
    checkboxValue: [],
    actionText: '相册/拍照',
    btnRgc: '',
    itemsValue: [
      {
        checked: false,
        value: "私锁私用",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "车牌缺损",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "轮胎坏了",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "车锁坏了",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "违规乱停",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "密码不对",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "刹车坏了",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "其他故障",
        color: "#b9dd08"
      }
    ]
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '保障维修',
    })
  },
  checkboxChange: function(e) {
    console.log(e.detail)
    let _values = e.detail.value;
    if(_values.length === 0) {
      this.setData({
        btnBgc: ""
      })
    }else {
      this.setData({
        checkboxValue: _values,
        btnBgc: "#FBE852"
      })
    }
  },
  numberChange: function(e) {
    this.setData({
      inputValue: {
        num: e.detail.value,
        desc: this.data.inputValue.desc,
      }
    })
  },
  descChange: function(e) {
    this.setData({
      inputValue: {
        num: this.data.inputValue.num,
        desc: e.detail.value,
      }
    })
  },
  bindCamera: function() {
    wx.chooseImage({
      count: 4,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success:(res) => {
        console.log('res',res)
        let tfps = res.tempFilePaths,
            _picUrls = this.data.picUrls;
        for(let item of tfps){
          _picUrls.push(item);
          this.setData({
            picUrls: _picUrls,
            actionText: "+"
          })
        }
      }
    })
  },
  delPic: function(e) {
    console.log('e',e);
    let index = e.target.dataset.index,
        _picUrls = this.data.picUrls;

    _picUrls.splice(index,1);

    this.setData({
      picUrls: _picUrls
    })
  },
  formSubmit: function(e) {
    if(this.data.picUrls.length > 0 && this.data.checkboxValue.length > 0) {
      wx.request({
        url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/msg',
        data: {
          // picUrls: this.data.picUrls,
          // inputValue: this.data.inputValue,
          // checkboxValue: this.data.checkboxValue
        },
        method: 'get', // POST
        // header: {}, // 设置请求的 header
        success: function (res) {
          wx.showToast({
            title: res.data.data.msg,
            icon: 'success',
            duration: 2000
          })
        }
      })
    }else {
      wx.showModal({
        title: '请填写反馈信息',
        content: '赶紧填信息啦',
        confirmText: '好的',
        cancelText: '不填',
        success:(res) => {
          if(res.confirm) {

          }else {
            console.log('back');
            wx.navigateBack({
              delta: 1 // 回退前 delta(默认为1) 页面
            });
          }
        },
      })
    }
  },
})