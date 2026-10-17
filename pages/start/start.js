const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
Page({
  data: {
    swiperMaxNumber: 0,
    swiperCurrent: 0
  },
  onLoad(e){
    this.readConfigVal()
    // 补偿写法
    getApp().configLoadOK = () => {
      this.readConfigVal()
    }
  },
  onShow:function(){

  },
  async readConfigVal() {
    // 启动引导页开关：false 直接进首页；true 展示引导轮播（见 config.js）
    if (!CONFIG.showStartPage) {
      wx.switchTab({
        url: '/pages/index/index',
      })
      return
    }
    const mallName = wx.getStorageSync('mallName')
    if (!mallName) {
      return
    }
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    const app_show_pic_version = wx.getStorageSync('app_show_pic_version')
    if (app_show_pic_version && app_show_pic_version == CONFIG.version) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      // 展示启动页
      const res = await WXAPI.banners({
        type: 'app'
      })
      if (res.code == 700) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        this.setData({
          banners: res.data,
          swiperMaxNumber: res.data.length
        });
      }
    }
  },
  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  goLeft() {
    if (this.data.swiperCurrent == 0) {
      this.setData({
        swiperCurrent: this.data.swiperMaxNumber - 1
      })
    } else {
      this.setData({
        swiperCurrent: this.data.swiperCurrent - 1
      })
    }
  },
  goRight() {
    if (this.data.swiperCurrent == this.data.swiperMaxNumber - 1) {
      this.setData({
        swiperCurrent: 0
      })
    } else {
      this.setData({
        swiperCurrent: this.data.swiperCurrent + 1
      })
    }
  },
  goToIndex: function (e) {
    if (getApp().globalData.isConnected) {
      wx.setStorage({
        key: 'app_show_pic_version',
        data: CONFIG.version
      })
      wx.switchTab({
        url: '/pages/index/index',
      });
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  }
});
