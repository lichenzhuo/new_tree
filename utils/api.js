import http from 'http.js' //引入上面封装好的请求方法
//获取token
const getTokenApi = (data) => {
  return http({
    url: '/Login/UserLogin',
    method: 'POST',
    data: data
  })
}
// 获取树木信息
const getMyTreeApi = (token,sign) => {
  return http({
    url: '/Tree/MySapling',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      Sign:sign
    }
  })
}
// 登录集水滴
const getLoginDayApi = (token,data) => {
  return http({
    url: '/Tree/SignRewardList',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 浇水
const setTreeEnergyApi = (token,data) => {
  return http({
    url: '/Tree/ConTreeEnergy',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 获取所有树木
const getTreeListApi = (token,data) => {
  return http({
    url: '/Tree/TreeList',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 创建树木
const createTreeApi = (token,data) => {
  return http({
    url: '/Tree/CreateMySapling',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 获取能量
// TYPE=1是登录领能量TYPE=2分享
const getEnergyApi = (token,data) => {
  return http({
    url: '/Tree/ObtainTreeEnergy',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 活动规则
const getActivityRulesApi = (token,data) => {
  return http({
    url: '/Tree/ActivityRules',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 检查token是否过期
const getRefreshApi = (token,data) => {
  return http({
    url: '/Login/RefreshLogin',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 获取背景音乐
const getBgAudioApi = (token,data) => {
  return http({
    url: '/Tree/bgMusic',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 积分兑换—商品列表
const getProductListApi = (token,data) => {
  return http({
    url: '/Product/ProductList',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 积分兑换—兑换
const getExchangeApi = (token,data) => {
  return http({
    url: '/Product/IntegralExchange',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 积分兑换—广告
const getAdvertApi = (token,data) => {
  return http({
    url: '/Product/Advert',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 积分兑换—兑换列表
const getExchangeListApi = (token,data) => {
  return http({
    url: '/Product/ExchangeList',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
// 积分兑换—核销
const getExchangeWriteOffApi = (token,data) => {
  return http({
    url: '/Product/ExchangeWriteOff',
    method: 'POST',
    header:{
      'Authorization': 'Bearer ' + token
    },
    data: {
      ...data
    }
  })
}
export default  {
  getTokenApi,
  getMyTreeApi,
  getLoginDayApi,
  setTreeEnergyApi,
  getTreeListApi,
  createTreeApi,
  getEnergyApi,
  getActivityRulesApi,
  getRefreshApi,
  getBgAudioApi,
  getProductListApi,
  getExchangeApi,
  getAdvertApi,
  getExchangeListApi,
  getExchangeWriteOffApi
}