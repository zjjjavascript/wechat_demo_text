let app = getApp();
var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');

Page({
  data: {
    scale: 18,
    latitude: 0,
    longitude: 0,
    polyline: []
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var article_id = wx.getStorageSync('current_article_id');
    return {
      title: '我的小程序',
      path: '/pages/index?article_id=' + article_id,
    }
  },
  onLoad: function(options) {
    this.timer = options.timer;
    this.keywords = options.keywords;
    wx.showShareMenu({
      withShareTicket: true,
    })
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          longitude: Number(res.longitude),
          latitude: Number(res.latitude),
        })
        if (this.keywords) {
          this.getRideRoutes(options);
        }
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [
            {
              id: 1,
              iconPath: '/images/location.png',
              position: {
                left: 20,
                top: res.windowHeight - 80,
                width: 50,
                height: 50,
              },
              clickable: true,
            },
            {
              id: 2,
              iconPath: '/images/use.png',
              position: {
                left: res.windowWidth / 2 - 45,
                top: res.windowHeight - 100,
                width: 90,
                height: 90,
              },
              clickable: true,
            },
            {
              id: 3,
              iconPath: '/images/warn.png',
              position: {
                left: res.windowWidth - 70,
                top: res.windowHeight - 80,
                width: 50,
                height: 50,
              },
              clickable: true,
            },
            {
              id: 4,
              iconPath: '/images/marker.png',
              position: {
                left: res.windowWidth / 2 - 11,
                top: res.windowHeight / 2 - 45,
                width: 29,
                height: 45,
              },
              clickable: false,
            },
            {
              id: 5,
              iconPath: '/images/avatar.png',
              position: {
                left: res.windowWidth - 68,
                top: res.windowHeight - 155,
                width: 45,
                height: 45,
              },
              clickable: true,
            },
            {
              id: 6,
              iconPath: '/images/goto.png',
              position: {
                left: res.windowWidth - 68,
                top: res.windowHeight - 605,
                width: 45,
                height: 45,
              },
              clickable: true,
            },
          ]
        })
      }
    })
    wx.request({
      url:'https://www.easy-mock.com/mock/5b0f56f3f4a5d03f39587c87/ofo_data/ofodata/bicylePosition',
      data: {},
      method: 'GET',
      success: (res) => {
        this.setData({         
          markers: res.data.data
        })
      }
    })
  },
  bindcontroltap: function(e) {
    switch(e.controlId) {
      case 1:
        this.movetoPosition();
        break;
      case 2: 
        if(this.timer === '' || this.timer === undefined) {
          wx.scanCode({
            success: (res) => {
              ws.showLoading({
                title: '正在获取密码',
                mask: true,
              })
            }
          })
          wx.request({
            url:'https://www.easy-mock.com/mock/5b0f56f3f4a5d03f39587c87/ofo_data/password',
            data: {},
            method: 'GET',
            success: function(res) {
              wx.hideLoading();
              wx.redirectTo({
                url: '../scanresult/index?password=' + res.data.data.password + '&number=' + res.data.data.number,
                success: function(res) {
                  wx.showToast({
                    title: '获取密码成功',
                    duration: 1000,
                  })
                }
              })
            }
          })
        }else {
          wx.navigateBack({
            delta: 1,
          })
        }
        break;
      case 3:
        wx.navigateTo({
          url: '../warn/index',
        });
        break;
      case 5: 
        wx.navigateTo({
          url: '../my/index',
        });
        break;
      case 6: 
        wx.navigateTo({
          url: '../searchSite/index',
        })
      default:
        break;
    }
  },
  bindmarkertap: function(e) {
    let _markers = this.data.markers,
        markerId = e.markerId,
        currMarker = _markers[markerId];
    this.setData({
      polyline: [
        {
          points: [{
            longitude: this.data.longitude,
            latitude: this.data.latitude,
          },{
            longitude: currMarker.longitude,
            latitude: currMarker.latitude,
          }],
          color: '#FF0000DD',
          width: 1,
          dottedLine: true,
        }
      ],
      scale: 18,
    })
  },
  bindregionchange: function (e) {
    console.log('e',e)
    if (e.type == "begin") {
      wx.request({
        url: 'https://www.easy-mock.com/mock/5b0f56f3f4a5d03f39587c87/ofo_data/ofodata/bicylePosition',
        data: {},
        method: 'GET',
        success: (res) => {
          this.setData({
            _markers: res.data.data
          })
        }
      })
    } else if (e.type == "end") {
      this.setData({
        markers: this.data._markers
      })
    }
  },
  onShow: function (e) {
    this.mapCtx = wx.createMapContext("ofoMap");
    this.movetoPosition();
  },
  movetoPosition: function() {
    this.mapCtx.moveToLocation()
  },
  getRideRoutes(options) {
    console.log(this.data.longitude, this.data.latitude)
    let origin = '' + this.data.longitude + ',' + this.data.latitude,
      destination = options.keywords;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getDrivingRoute({
      origin: origin,
      destination: destination,
      success: (data) => {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
          if (data.paths[0] && data.paths[0].distance) {
            let distance = parseInt(data.paths[0].distance / 1000);
             if(1 <= distance < 4) {
               this.setData({
                 scale: 15
               })
             }else if(4<= distance < 7){
               this.setData({
                 scale: 13
               })
             }else {
               this.setData({
                 scale: 11
               })
             }
          }
        }
        this.setData({
          polyline: [{
            points: points,
            color: "#FBE852",
            width: 6,
            arrowLine: true,
          }]
        });
        console.log('poly',this.data.polyline)
      }
    })

  },
})