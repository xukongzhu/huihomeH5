// uid，用户ID，整型，必须
// serialNo，流水号，字符型，必须
// authCode，验证码，字符型，必须，产生参见接口通用约定
// datatype ，数据类型, 1=工地动态，2=灵感(作品)，3=攻略，2001=作品单图
// dataid ，数据id
// 响应数据
// {"respCode":"00","respMsg":"OK"}
import config from './config.class'
export default class shareWeb {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.shareWebAdd = config.SERVERADD() + "/huihome/api/user/favorite"
    this.shareWebAdd1 = config.SERVERADD() + "/huihome/api/user/unfavorite"
    this.defaultData = {}
  }

  request(param, type) {
    if (type == 1) {
      return this.VC.$http.post(this.shareWebAdd1, param)
    } else {
      return this.VC.$http.post(this.shareWebAdd, param)
    }
  }
}
