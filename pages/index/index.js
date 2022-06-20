// index.js
// 获取应用实例
const app = getApp()
import Toast from '@vant/weapp/toast/toast'
var util = require('../../utils/md5.js') // 引入md5.js文件
const imgUrl = 'https://www.hzxune.com'
import Api from '../../utils/api.js'
import download from '../../utils/download.js'
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
    showScoreHistory: false,
    showIndexAdvert: false,
    IndexAdvertUrl: '',
    showIndexAdvertMask: false
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
          this.delayGetMyTree(resultData, text)
        } else {
          wx.showLoading()
        }
      }, time)
    } else {
      wx.hideLoading()
      if (resultData.IsSuccess) {
        if (resultData.Data) {
          // 背景图
          if (await this.checkUrl(imgUrl + resultData.Data.BackgroundPicurl) === 2) {
            console.log('有背景图')
            this.setData({
              BackgroundPicurl: wx.getStorageSync(imgUrl + resultData.Data.BackgroundPicurl)
            })
          } else {
            this.setData({
              BackgroundPicurl: imgUrl + resultData.Data.BackgroundPicurl
            })
            download.downloadImg(imgUrl + resultData.Data.BackgroundPicurl)
          }
          // 生长gif图
          if (await this.checkUrl(imgUrl + resultData.Data.gifPicurl) === 2) {
            console.log('有gif')
            this.setData({
              myTreeImgUrlGif: wx.getStorageSync(imgUrl + resultData.Data.gifPicurl)
            })
          } else {
            this.setData({
              myTreeImgUrlGif: imgUrl + resultData.Data.gifPicurl
            })
            download.downloadImg(imgUrl + resultData.Data.gifPicurl)
          }
          // 树苗图片
          if (await this.checkUrl(imgUrl + resultData.Data.Picurl) === 2) {
            console.log('有树苗图片')
            this.setData({
              myTreeImgUrl: wx.getStorageSync(imgUrl + resultData.Data.Picurl)
            })
          } else {
            this.setData({
              myTreeImgUrl: imgUrl + resultData.Data.Picurl
            })
            download.downloadImg(imgUrl + resultData.Data.Picurl)
          }
          this.setData({
            myTreeData: resultData.Data,
            myScore: resultData.Data.Integral,
            myEnergy: resultData.Data.StorageEnergy,
            treePercent: resultData.Data.Ratio,
            treePercentWidth: resultData.Data.Ratio * 220,
            canClick: true
          })
          // 获取树木缓存信息
          // this.getTreeCache()
          if (resultData.Data.isSign === 0) {
            this.getLoginEnergy()
            this.getIndexAdvert()
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
  delayGetMyTree(resultData, text) {
    wx.hideLoading()
    const fs = wx.getFileSystemManager()
    // 背景图
    if (wx.getStorageSync(imgUrl + resultData.Data.BackgroundPicurl)) {
      fs.access({
        path: imgUrl + resultData.Data.BackgroundPicurl,
        success(res) {
          // 文件存在
          this.setData({
            BackgroundPicurl: wx.getStorageSync(imgUrl + resultData.Data.BackgroundPicurl)
          })
        },
        fail(res) {
          // 文件不存在或其他错误
          this.setData({
            BackgroundPicurl: imgUrl + resultData.Data.BackgroundPicurl
          })
          download.downloadImg(imgUrl + resultData.Data.BackgroundPicurl)
        }
      })
    } else {
      this.setData({
        BackgroundPicurl: imgUrl + resultData.Data.BackgroundPicurl
      })
      download.downloadImg(imgUrl + resultData.Data.BackgroundPicurl)
    }
    // 生长gif图
    if (wx.getStorageSync(imgUrl + resultData.Data.gifPicurl)) {
      fs.access({
        path: imgUrl + resultData.Data.gifPicurl,
        success(res) {
          // 文件存在
          this.setData({
            myTreeImgUrlGif: wx.getStorageSync(imgUrl + resultData.Data.gifPicurl)
          })
        },
        fail(res) {
          // 文件不存在或其他错误
          this.setData({
            myTreeImgUrlGif: imgUrl + resultData.Data.gifPicurl
          })
          download.downloadImg(imgUrl + resultData.Data.gifPicurl)
        }
      })
    } else {
      this.setData({
        myTreeImgUrlGif: imgUrl + resultData.Data.gifPicurl
      })
      download.downloadImg(imgUrl + resultData.Data.gifPicurl)
    }
    // 树苗图片
    if (wx.getStorageSync(imgUrl + resultData.Data.Picurl)) {
      fs.access({
        path: imgUrl + resultData.Data.Picurl,
        success(res) {
          // 文件存在
          this.setData({
            myTreeImgUrl: wx.getStorageSync(imgUrl + resultData.Data.Picurl)
          })
        },
        fail(res) {
          // 文件不存在或其他错误
          this.setData({
            myTreeImgUrl: imgUrl + resultData.Data.Picurl
          })
          download.downloadImg(imgUrl + resultData.Data.Picurl)
        }
      })
    } else {
      this.setData({
        myTreeImgUrl: imgUrl + resultData.Data.Picurl
      })
      download.downloadImg(imgUrl + resultData.Data.Picurl)
    }
    this.setData({
      showGif: false,
      showOverShare: true,
      overShareText: text,
      myTreeData: resultData.Data,
      myScore: resultData.Data.Integral,
      myEnergy: resultData.Data.StorageEnergy,
      treePercent: resultData.Data.Ratio,
      treePercentWidth: resultData.Data.Ratio * 220,
      canClick: true
    }, () => {
      setTimeout(() => {
        that.setData({
          showOverShare: false,
          overShareText: ''
        })
      }, 1000)
    })
  },
  // 判断图片路径是否被缓存和图片是否下载
  async checkUrl(url) {
    const fs = wx.getFileSystemManager()
    const path = wx.getStorageSync(url)
    if (path) {
      try {
        fs.accessSync(path)
        return 2
      } catch (e) {
        return 3
      }
    } else {
      console.log(url, 4)
      return 4
    }
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
  // 获取树木缓存信息
  async getTreeCache() {
    let that = this
    const params = {
      Sign: util.md5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getTreeCacheApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    console.log(resultData)
    download.downloadImg(imgUrl + resultData.Data.BackgroundPicurl)
    resultData.Data.treeStages.forEach(item => {
      if (item.Picurl) {
        download.downloadImg(imgUrl + item.Picurl)
      }
      if (item.gifPicurl) {
        download.downloadImg(imgUrl + item.gifPicurl)
      }
    })
  },
  // 获取首页广告
  async getIndexAdvert() {
    let that = this
    that.setData({
      showIndexAdvertMask: true
    })
    const params = {
      Sign: util.md5(`key=13cd9f36-d186-4038-ab48-4b86b187fb70`)
    }
    let result = await Api.getIndexAdvertApi(wx.getStorageSync('token'), params)
    const resultData = result.data
    this.setData({
      IndexAdvertUrl: imgUrl + resultData.Data.pic,
      showIndexAdvertMask: false
    }, () => {
      that.setData({
        showIndexAdvert: true
      }, () => {
        setTimeout(() => {
          that.setData({
            showIndexAdvert: false
          })
        }, 10000)
      })
    })
  },
  // 关闭广告弹框
  closeIndexAdvert() {
    this.setData({
      showIndexAdvert: false
    })
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
                  // myTreeImgUrlGif: imgUrl + that.data.myTreeData.gifPicurl,
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
        if (!resultData.IsSuccess) {}
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
  // 获取背景音乐
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
  // 获取积分使用记录
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
  // 暂停/播放音乐
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
  // 去积分兑换好礼
  gotoList() {
    wx.switchTab({
      url: '../score/index',
    })
  },
  // 页面隐藏
  onHide() {
    // 当页面隐藏时，暂停音乐
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