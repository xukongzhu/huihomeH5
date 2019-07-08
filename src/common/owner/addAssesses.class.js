// merid, 商户id
// uid, 用户ID，必传
// serialNo，流水号，必传
// authCode，验证码，必传
// assessType, 评价类型，0=到店评价，1=购买评价
// pointA 到店评价（购买评价：商品质量）
// pointB 购买评价：服务态度
// pointC 购买评价：描述相同
// msgtxt 评价内容
// parentid 追评的父评价ID
// imgUrl 评价图片url字段，多个以逗号（,）分割
// dataId 数据ID （当数据类型不为0时，必填）
// dataType 数据类型 礼券 dataType =1 ，活动dataType=2 商家 默认0
// 响应数据
//
// {"respCode":"00","respMsg":"OK"}
import config from '../config.class'
export default class shareWeb {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.shareWebAdd = config.SERVERADD() + "/huihome/api/merchant/assess2"
    this.defaultData = {}
  }

  request(param) {
    return this.VC.$http.post(this.shareWebAdd, param)
  }
}
