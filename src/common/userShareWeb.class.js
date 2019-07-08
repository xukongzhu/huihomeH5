// 通用Web页面分享记录
// 接口说明
// 接口地址
//
// http://112.124.35.101:8080/huihome/api/user/shareWeb
//
// Post请求参数
//
// uid，分享者用户ID，整型，未登录为-1, 必选
// shareMode 分享方式（0=朋友圈，1=微信，2=QQ，3=QQ空间，4=微博）, 必选
// pageUrl 分享页面url, 必选
// pageTitle 分享页面标题, 可选
// datatype 数据类型，定义如下, 可选
// 0=工地详情,1=工地动态,2=灵感（装修方案）,3=攻略,4=活动,5=团购,6=话题,7=web页面,
// 8=作品,9=工长详情,10=设计师详情,11客服详情,12工作室详情,13话题,15求助详情,16监理详情
// dataid 数据id, 可选
// 响应数据
//
// {"respCode":"00","respMsg":"OK"}
import config from './config.class'
export default class shareWeb {
    constructor(vueComponent, dataSet) {
        this.VC = vueComponent
        this.DS = dataSet
        this.shareWebAdd = config.SERVERADD()+"/huihome/api/user/shareWeb"
        this.defaultData = {}
    }

    request(param) {
        if (!param || !param.uid || !param.shareMode || !pqaram.pageUrl) {
            throw new Error('params missing')
        }
        return this.VC.$http.post(this.shareWebAdd, param)
    }
}
