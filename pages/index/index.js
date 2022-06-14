// index.js
// 获取应用实例
const app = getApp()
import Toast from '@vant/weapp/toast/toast'
var util = require('../../utils/md5.js') // 引入md5.js文件
const imgUrl = 'https://www.hzxune.com'
import Api from '../../utils/api.js'
const audioCtx = '';
Page({
  data: {
    token: '',
    openIdCode: '',
    phoneCode: '',
    showMask: false,
    myTreeData: {},
    myScore: '',
    myEnergy: '',
    treePercent: 0,
    treePercentWidth: 0,
    BackgroundPicurl: 'http://green.hzxune.com/mtsc/123.png',
    myTreeImgUrl: '',
    treeList: [],
    showNewSelect: false,
    selectIndex: '',
    selectTreeId: '',
    showMyTree: false,
    showLoginDay: false,
    dayList: [],
    canClick: true,
    showOverShare: false,
    overShareText: '',
    showActivityRules: false,
    ActivityRulesText: '',
    animation: '',
    showGif: false,
    myTreeImgUrlGif: '',
    bgAudio: '',
    startSong: false,
    showScoreHistory: false
  },
  onLoad() {
    wx.hideTabBar()
  },
  onReady() {
    wx.hideTabBar()
  },
  async onShow() {
    wx.hideTabBar()
    // this.getBgAudio()
    let that = this
    wx.login({
      success: (res) => {
        if (res.code) {
          this.setData({
            openIdCode: res.code
          })
          wx.getStorage({
            key: "token",
            success(res) {
              const params = {
                Sign: util.md5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
              }
              Api.getRefreshApi(wx.getStorageSync('token'), params).then(res => {
                const resultData = res.data
                if (resultData.IsSuccess) {
                  if (resultData.Data) {
                    wx.setStorage({
                      key: "token",
                      data: resultData.Data,
                      success() {
                        that.getMyTree()
                      }
                    })
                  } else {
                    that.getMyTree()
                  }
                } else {
                  that.setData({
                    showMask: true
                  })
                }
              })
            },
            fail() {
              that.setData({
                showMask: true
              })
            }
          })
        } else {}
      }
    })
  },
  // 开始动画
  startAnimation() {
    this.animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'linear',
      delay: 10,
      transformOrigin: '50% 0 0'
    })
    this.animation1 = wx.createAnimation({
      duration: 600,
      timingFunction: 'linear',
      delay: 500
    })
    this.animation2 = wx.createAnimation({
      duration: 800,
      timingFunction: 'linear',
      delay: 10,
      transformOrigin: '50% 0 0'
    })
    let next = true;
    setInterval(function () {
      if (next) {
        this.animation.scale(0.95).step();
        // this.animation1.rotate(30).step() 
        this.animation2.translate(0, -2).step();
        next = !next;
      } else {
        this.animation.scale(1).step();
        // this.animation1.rotate(-30).step() 
        this.animation2.translate(0, 2).step();
        next = !next;
      }
      // that.animation1.rotate(360).step() 
      this.setData({ //输出动画  
        animation: this.animation.export(),
        // animation1: this.animation1.export(),
        animation2: this.animation2.export()
      })
    }.bind(this), 500)
    setInterval(function () {
      if (next) {
        this.animation1.rotate(30).step()
        next = !next;
      } else {
        this.animation1.rotate(-30).step()
        next = !next;
      }
      this.setData({ //输出动画  
        animation1: this.animation1.export(),
      })
    }.bind(this), 1000)
  },
  onClickHide() {
    this.setData({
      historyList: [],
      ActivityRulesText: '',
      showMyTree: false,
      showLoginDay: false,
      showActivityRules: false,
      showScoreHistory: false,
    })
  },
  // 获取token
  async getToken(params) {
    // wx.showLoading()
    let result = await Api.getTokenApi(params);
    const resultData = result.data
    if (!resultData.IsSuccess) {
      // wx.hideLoading()
      wx.showToast({
        title: '获取token失败',
        icon: 'error',
        duration: 2000
      })
    } else {
      wx.setStorage({
        key: "token",
        data: resultData.Data
      })
      this.setData({
        showMask: false,
        token: resultData.Data
      })
      this.getMyTree()
    }
  },
  // 获取当前我种的树信息
  async getMyTree(type, time, text) {
    this.startAnimation()
    this.getBgAudio()
    let that = this
    const Sign = util.md5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    const token = wx.getStorageSync('token')
    let result = await Api.getMyTreeApi(token, Sign)
    // wx.hideLoading()
    const resultData = result.data
    if (type === 'delay') {
      setTimeout(() => {
        if (resultData) {
          wx.hideLoading()
          if (resultData.Data.BackgroundPicurl) {
            this.setData({
              BackgroundPicurl: imgUrl + resultData.Data.BackgroundPicurl
            })
          }
          that.setData({
            showGif: false,
            showOverShare: true,
            overShareText: text,
            myTreeImgUrlGif: imgUrl + resultData.Data.gifPicurl,
            myTreeData: resultData.Data,
            myScore: resultData.Data.Integral,
            myEnergy: resultData.Data.StorageEnergy,
            treePercent: resultData.Data.Ratio,
            treePercentWidth: resultData.Data.Ratio * 220,
            myTreeImgUrl: imgUrl + resultData.Data.Picurl,
            canClick: true
          }, () => {
            setTimeout(() => {
              that.setData({
                showOverShare: false,
                overShareText: ''
              })
            }, 1000)
          })
        } else {
          wx.showLoading()
        }
      }, time)
    } else {
      wx.hideLoading()
      if (resultData.IsSuccess) {
        if (resultData.Data) {
          if (resultData.Data.BackgroundPicurl) {
            this.setData({
              BackgroundPicurl: imgUrl + resultData.Data.BackgroundPicurl
            }) 
          }
          this.setData({
            myTreeData: resultData.Data,
            myTreeImgUrlGif: imgUrl + resultData.Data.gifPicurl,
            myScore: resultData.Data.Integral,
            myEnergy: resultData.Data.StorageEnergy,
            treePercent: resultData.Data.Ratio,
            treePercentWidth: resultData.Data.Ratio * 220,
            myTreeImgUrl: imgUrl + resultData.Data.Picurl,
            canClick: true
          })
          if (resultData.Data.isSign===0) {
            this.getLoginEnergy()
          }
        } else {
          // 没有树木信息，需要种树
          this.getTreeList('1')
        }
      } else {
        // token过期
      }
    }
    // wx.showLoading()
  },
  // 获取手机号
  getPhoneNumber(e) {
    if (e.detail.code) {
      this.setData({
        phoneCode: e.detail.code
      })
      const Sign = util.md5(`openIdCode=${this.data.openIdCode}&phoneCode=${e.detail.code}&key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
      const params = {
        openIdCode: this.data.openIdCode,
        phoneCode: e.detail.code,
        Sign: Sign
      }
      this.getToken(params)
    }

  },
  // 登录集水滴
  async loginDay() {
    let that = this
    // wx.showLoading()
    const params = {
      Sign: util.md5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getLoginDayApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    if (resultData.IsSuccess) {
      this.setData({
        dayList: resultData.Data,
        showLoginDay: true
      })
    } else {
      // token过期
    }
  },
  // 获取登陆能量
  async getLoginEnergy() {
    const params = {
      type: 1,
      Sign: util.md5(`type=1&key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getEnergyApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    if (resultData.Data) {
      let obj = JSON.parse(JSON.stringify(this.data.myTreeData))
      obj.signDay = resultData.Data.signDay
      obj.Integral = resultData.Data.Integral
      obj.StorageEnergy = resultData.Data.StorageEnergy
      this.setData({
        myTreeData: obj
      })
    } else {}
  },
  // 浇水
  async setEnergy() {
    if (this.data.canClick) {
      let that = this
      if (that.data.myEnergy <= 0) {
        that.setData({
          showOverShare: true,
          overShareText: '能量不足'
        }, () => {
          setTimeout(() => {
            that.setData({
              showOverShare: false,
              overShareText: ''
            })
          }, 1000)
        })
      } else {
        const params = {
          treeId: this.data.myTreeData.treeId,
          Sign: util.md5(`treeId=${this.data.myTreeData.treeId}&key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
        }
        let result = await Api.setTreeEnergyApi(wx.getStorageSync('token'), params)
        const resultData = result.data
        that.setData({
          showJiaoShui: true,
          canClick: false
        }, () => {
          setTimeout(() => {
            that.setData({
              showJiaoShui: false,
            })
            if (resultData.IsSuccess) {
              if (resultData.Data.statu === 0) {
                let obj = JSON.parse(JSON.stringify(this.data.myTreeData))
                obj.explain = resultData.Data.explain
                that.setData({
                  myTreeData: obj,
                  myEnergy: resultData.Data.StorageEnergy,
                  treePercent: resultData.Data.Ratio,
                  treePercentWidth: resultData.Data.Ratio * 220,
                  canClick: true
                })
              } else if (resultData.Data.statu === 1) {
                that.getMyTree('delay', Number(that.data.myTreeData.gifTime) * 1000, resultData.Data.tips)
                let obj = JSON.parse(JSON.stringify(this.data.myTreeData))
                obj.Ratio = resultData.Data.Ratio
                obj.StorageEnergy = resultData.Data.StorageEnergy
                obj.explain = resultData.Data.explain
                that.setData({
                  showGif: true,
                  myTreeData: obj,
                  treePercent: resultData.Data.Ratio,
                  treePercentWidth: resultData.Data.Ratio * 220,
                  myEnergy: resultData.Data.StorageEnergy,
                  myTreeImgUrlGif: imgUrl + that.data.myTreeData.gifPicurl,
                })
              } else {
                // that.setData({
                //   canClick: true
                // })
                Toast({
                  type: 'success',
                  message: '种树完成，可以种下一颗了',
                  onClose: () => {
                    that.getTreeList('1')
                  },
                });
              }
            }
          }, 2000)
        })
        if (!resultData.IsSuccess) {
          // that.setData({
          //   showMask: true,
          //   canClick: true
          // })
        }
        // if (resultData.IsSuccess) {
        //   if (resultData.Data.statu === 0) {
        //     let obj = JSON.parse(JSON.stringify(this.data.myTreeData))
        //     obj.explain = resultData.Data.explain
        //     that.setData({
        //       myTreeData: obj,
        //       myEnergy: resultData.Data.StorageEnergy,
        //       treePercent: resultData.Data.Ratio,
        //       treePercentWidth: resultData.Data.Ratio * 220,
        //     })
        //   } else if (resultData.Data.statu === 1) {
        //     that.getMyTree('delay', Number(that.data.myTreeData.gifTime) * 1000, resultData.Data.tips)
        //     let obj = JSON.parse(JSON.stringify(this.data.myTreeData))
        //     obj.Ratio = resultData.Data.Ratio
        //     obj.StorageEnergy = resultData.Data.StorageEnergy
        //     obj.explain = resultData.Data.explain
        //     that.setData({
        //       showGif: true,
        //       myTreeData: obj,
        //       treePercent: resultData.Data.Ratio,
        //       treePercentWidth: resultData.Data.Ratio * 220,
        //       myEnergy: resultData.Data.StorageEnergy,
        //       myTreeImgUrlGif: imgUrl + that.data.myTreeData.gifPicurl,
        //     })
        //   } else {
        //     Toast({
        //       type: 'success',
        //       message: '种树完成，可以种下一颗了',
        //       onClose: () => {
        //         that.getTreeList('1')
        //       },
        //     });
        //   }
        // } 
        // else {
        //   that.setData({
        //     showMask: true
        //   })
        // }
      }
    }

  },
  // 获取所有树木
  async getTreeList(type) {
    let that = this
    // wx.showLoading()
    const params = {
      Sign: util.md5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getTreeListApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    if (resultData.IsSuccess) {
      // wx.hideLoading()
      this.setData({
        treeList: resultData.Data
      })
      if (JSON.stringify(this.data.myTreeData) === '{}' || type === '1') {
        // 选择种树
        this.setData({
          showNewSelect: true,
          selectIndex: ''
        })
      } else {
        // 查看种过的树
        this.setData({
          showMyTree: true
        })
      }
    } else {
      // token过期
    }
  },
  // 点击选择树木
  selectMyTree(e) {
    this.setData({
      selectIndex: e.currentTarget.dataset.index,
      selectTreeId: e.currentTarget.dataset.treeid
    })
  },
  // 种树
  async confirmSelect() {
    if (!this.data.selectTreeId) {
      wx.showToast({
        icon: 'none',
        title: '请选择树木'
      })
      return
    }
    let that = this
    this.setData({
      showNewSelect: false
    })
    // wx.showLoading()
    const params = {
      treeId: this.data.selectTreeId,
      Sign: util.md5(`treeId=${this.data.selectTreeId}&key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.createTreeApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    if (resultData.IsSuccess) {
      // wx.hideLoading()
      that.initData()
      Toast({
        type: 'success',
        message: '种树成功',
        onClose: () => {
          that.getMyTree()
        },
      });
    } else {
      // wx.showLoading()
    }
  },
  // 活动规则
  async getActivityRules() {
    const params = {
      Sign: util.md5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getActivityRulesApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    let text = resultData.Data.replace(/↵/g, '\n')
    this.setData({
      showActivityRules: true,
      ActivityRulesText: text
    })
  },
  // 分享
  async onShareAppMessage() {
    let that = this
    const params1 = {
      type: 2,
      Sign: util.md5(`type=2&key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result1 = await Api.getEnergyApi(wx.getStorageSync('token'), params1)
    const resultData1 = result1.data
    let obj = JSON.parse(JSON.stringify(this.data.myTreeData))
    if (resultData1.Data) {
      obj.signDay = resultData1.Data.signDay
      obj.Integral = resultData1.Data.Integral
      obj.StorageEnergy = resultData1.Data.StorageEnergy
      this.setData({
        myTreeData: obj
      })
    } else {
      this.setData({
        showOverShare: true,
        overShareText: resultData1.Msg
      }, () => {
        setTimeout(() => {
          that.setData({
            showOverShare: false,
            overShareText: ''
          })
        }, 1000)
      })
      // 今日分享已完成！
    }
    // const promise = new Promise(resolve => {
    //   resolve({
    //     title: '绿粉农场',

    //   })
    // })
    return {
      title: '绿粉农场',
      imageUrl: '../../static/share.jpg',
      // promise
    }
  },
  // 初始化数据
  initData() {
    this.setData({
      showMask: false,
      myTreeData: {},
      myScore: '',
      myEnergy: '',
      treePercent: 0,
      treePercentWidth: 0,
      BackgroundPicurl: 'http://green.hzxune.com/mtsc/123.png',
      myTreeImgUrl: '',
      treeList: [],
      showNewSelect: false,
      selectIndex: '',
      selectTreeId: '',
      showMyTree: false,
      showLoginDay: false,
      dayList: [],
      canClick: true,
      showOverShare: false,
      overShareText: '',
      showActivityRules: false,
      ActivityRulesText: '',
      animation: '',
      showGif: false,
      myTreeImgUrlGif: ''
    })
  },
  async getBgAudio() {
    let that = this
    const params = {
      Sign: util.md5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getBgAudioApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    this.setData({
      bgAudio: imgUrl + '/' + resultData.Data
    }, () => {
      that.audioCtx = wx.createAudioContext('bgAudio');
      that.audioCtx.play()
      this.setData({
        startSong: true
      })
    })
  },
  async showHistory() {
    let that = this
    const params = {
      Sign: util.md5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getIntegralListApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    this.setData({
      historyList: resultData.Data,
      showScoreHistory: true
    })
  },
  pauseSong() {
    if (this.data.startSong) {
      this.audioCtx.pause()
      this.setData({
        startSong: false
      })
    } else {
      this.audioCtx.play()
      this.setData({
        startSong: true
      })
    }
  },
  gotoList() {
    wx.switchTab({
      url: '../score/index',
    })
  },
  onHide() {
    // 当页面影藏时，暂停音乐
    this.audioCtx.pause()
  },
  // 超出分享次数
  overShareClick() {
    let that = this
    this.setData({
      showOverShare: true,
      overShareText: '今日分享已完成！'
    }, () => {
      setTimeout(() => {
        that.setData({
          showOverShare: false,
          overShareText: ''
        })
      }, 1000)
    })
  }
})