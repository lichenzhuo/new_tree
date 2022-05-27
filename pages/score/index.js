// pages/score/index.js
const app = getApp()
import Toast from '@vant/weapp/toast/toast'
var util = require('../../utils/md5.js') // 引入md5.js文件
const imgUrl = 'https://www.hzxune.com'
import Api from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    type: 'all',
    ProductList: [],
    disabled: false,
    showTips: false,
    tipsText: '',
    AdvertData:{},
    webViewUrl:'',
    showWebView:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.showTabBar()
    this.getSearchList()
    this.getAdvert()
  },
  changeType() {
    if (this.data.type === 'all') {
      this.setData({
        type: 'my'
      })
    } else {
      this.setData({
        type: 'all'
      })
    }
    this.getSearchList()
  },
  onCancel() {
    this.setData({
      search: ''
    }, () => {
      this.getSearchList()
    })
  },
  // 搜索列表
  async getSearchList() {
    let that = this
    const params = {
      search: this.data.search,
      type: this.data.type,
      Sign: util.hexMD5(`search=${this.data.search}&type=${this.data.type}&key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getProductListApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    this.setData({
      ProductList: resultData.Data
    })
  },
  // 兑换
  async exchange(e) {
    this.setData({
      disabled: true
    })
    const item = e.currentTarget.dataset.item
    let that = this
    const params = {
      productId: item.pid,
      Sign: util.hexMD5(`productId=${item.pid}&key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getExchangeApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    this.setData({
      disabled: false
    })
    if (resultData.IsSuccess) {
      Toast.success('兑换成功')
    } else {
      this.setData({
        showTips: true,
        tipsText: resultData.Msg
      }, () => {
        setTimeout(() => {
          this.setData({
            showTips: false,
            tipsText: ''
          })
        }, 1000)
      })
    }
  },
  // 获取广告信息
  async getAdvert(){
    let that = this
    const params = {
      Sign: util.hexMD5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getAdvertApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    this.setData({
      AdvertData: resultData.Data
    })
  },
  goToAdvert(e){
    if (e.currentTarget.dataset.link) {
      this.setData({
        webViewUrl:e.currentTarget.dataset.link,
        showWebView:true
      })
    } else {
      
    }

    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})