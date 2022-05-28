// pages/myScore/index.js
const app = getApp()
import Toast from '@vant/weapp/toast/toast'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
var util = require('../../utils/md5.js') // 引入md5.js文件
const imgUrl = 'https://www.hzxune.com'
import Api from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ProductList: [],
    disabled: false,
    exchangeId:'',
    showTips: false,
    tipsText: ''
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
    this.getExchangeList()
  },
  // 获取列表
  async getExchangeList() {
    let that = this
    const params = {
      Sign: util.md5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getExchangeListApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    this.setData({
      ProductList: resultData.Data
    })
  },
  openExchange(e){
    let that = this
    this.setData({
      exchangeId:e.currentTarget.dataset.item.exId
    })
    wx.showModal({
      title: '',
      content: '确认是否核销？',
      success (res) {
        if (res.confirm) {
          // on confirm
        that.setData({
          disabled:true
        })
        that.exchange()
        } else if (res.cancel) {
           // on cancel
        that.setData({
          exchangeId:''
        })
        }
      }
    })
  },
  // 核销
  async exchange(){
    let that = this
    const params = {
      exId: this.data.exchangeId,
      Sign: util.md5(`exId=${this.data.exchangeId}&key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getExchangeWriteOffApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    this.setData({
      disabled: false
    })
    if (resultData.IsSuccess) {
      Toast.success('核销成功')
      this.getExchangeList()
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