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
    value:'',
    activeButton:false,
    ProductList:[]
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
  async onShow() {
    wx.showTabBar()
    let that = this
      const params = {
        Sign: util.hexMD5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
      }
      let result = await Api.getProductListApi(wx.getStorageSync('token'), params)
      const resultData = result.data
      this.setData({
        ProductList:resultData.Data
      })
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