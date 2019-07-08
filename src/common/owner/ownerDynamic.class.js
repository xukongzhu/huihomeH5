// projid 工地ID, 仅用于业主打开工地时
// banners banner列表数据，与首页相同
// subjects 为话题推荐列表
// cate 数据类型：0=工地详情,1=工地动态,2=灵感,3=攻略,4=活动,5=团购,6=话题,7=web页面,8=作品,9=工长详情,10=设计师详情,11客服详情,12工作室详情
// dataid 数据id
// pageurl 内容url
// title 标题
// img0 图片一
// shareTitle 分享标题
// shareDigest 分享摘要
// shareImg 分享图片
// shareUrl 分享url
// quickEntries 仅使用图片字段，两条记录
// dynaItems 为动态信息列表数据，与原来相同
import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/owner/detail2/dync"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid }&userid=${param.userid}&asc=${param.asc}&lastId=${param.lastId}&pageIndex=${param.pageIndex}&pageSize=${param.pageSize}&datatype=${param.datatype}`
    return this.VC.$http.get(DateUrl)
  }
}
