const WXAPI = require('apifm-wxapi')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')
const CONFIG = require('../../config.js')
const APP = getApp()

Page({
  data: {
    goods: [],
    loadingMoreHidden: true,
    curPage: 1,
    pageSize: 20,
    showBackTop: false, // 是否显示返回顶部按钮
  },
  toDetailsTap: function(e) {
    wx.navigateTo({
      url: `/pages/goods-details/index?id=${e.currentTarget.dataset.id}`,
    })
  },
  tapBanner(e) {
    const item = e.currentTarget.dataset.item
    if (item.linkType == 1) {
      // 跳小程序
      wx.navigateToMiniProgram({
        appId: item.appid,
        path: item.linkUrl || '',
      })
    } else {
      if (item.linkUrl) {
        wx.navigateTo({
          url: item.linkUrl
        })
      }
    }
  },
  onLoad: function(e) {
    wx.showShareMenu({
      withShareTicket: true,
    })
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        TOOLS.showTabBarBadge()
      } else {
        getApp().loginOK = () => {
          TOOLS.showTabBarBadge()
        }
      }
    })
    this.initBanners()
    this.getGoodsList(0)
    // 读取系统参数（店铺名称）
    this.readConfigVal()
    getApp().configLoadOK = () => {
      this.readConfigVal()
    }
  },
  readConfigVal() {
    wx.setNavigationBarTitle({
      title: CONFIG.mallName
    })
  },
  async initBanners(){
    const _data = {}
    // 读取头部轮播图
    const res1 = await WXAPI.banners({
      type: 'index'
    })
    if (res1.code == 700) {
      wx.showModal({
        title: '提示',
        content: '请在后台添加 banner 轮播图片，自定义类型填写 index',
        showCancel: false
      })
    } else {
      _data.banners = res1.data
    }
    this.setData(_data)
  },
  onShow: function(e){
    // 获取购物车数据，显示TabBarBadge
    TOOLS.showTabBarBadge()
    const refreshIndex = wx.getStorageSync('refreshIndex')
    if (refreshIndex) {
      this.onPullDownRefresh()
      wx.removeStorageSync('refreshIndex')
    }
  },
  async getGoodsList(categoryId, append) {
    if (categoryId == 0) {
      categoryId = "";
    }
    wx.showLoading({
      title: ''
    })
    // https://www.yuque.com/apifm/nu0f75/wg5t98
    const res = await WXAPI.goodsv2({
      categoryId: categoryId,
      page: this.data.curPage,
      pageSize: this.data.pageSize
    })
    wx.hideLoading()
    if (res.code == 404 || res.code == 700) {
      let newData = {
        loadingMoreHidden: false
      }
      if (!append) {
        newData.goods = []
      }
      this.setData(newData);
      return
    }
    let goods = [];
    if (append) {
      goods = this.data.goods
    }
    for (var i = 0; i < res.data.result.length; i++) {
      const item = res.data.result[i]
      const hidden_goods_index = wx.getStorageSync('hidden_goods_index')
      if (hidden_goods_index && hidden_goods_index.indexOf(item.id) != -1) {
        continue
      }
      goods.push(item);
    }
    this.setData({
      loadingMoreHidden: true,
      goods: goods,
    });
  },
  onShareAppMessage: function() {
    return {
      title: '"' + CONFIG.mallName + '" ' + wx.getStorageSync('share_profile'),
      path: '/pages/index/index'
    }
  },
  onShareTimeline() {
    return {
      title: '"' + CONFIG.mallName + '" ' + wx.getStorageSync('share_profile'),
    }
  },
  onReachBottom: function() {
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.getGoodsList(0, true)
  },
  onPullDownRefresh: function() {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(0)
    wx.stopPullDownRefresh()
  },
  // 页面滚动监听，控制返回顶部按钮显示
  onPageScroll(e) {
    const showBackTop = e.scrollTop > 400
    if (showBackTop !== this.data.showBackTop) {
      this.setData({ showBackTop })
    }
  },
  // 返回顶部
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
})
