const pubUrl = "https://www.hzxune.com/api"//数据接口的公共部分
const http = (options) =>{
  return new Promise((resolve,reject) => {
    wx.request({
      url: pubUrl+options.url,
      method:options.method || 'get',
      data:options.data || {},
      header: options.header || {
        'content-type':'application/json'
      },
      success:resolve,
      fail:reject
    })
  })
}
export default http