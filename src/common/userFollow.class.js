// uid，用户ID，整型，必须
// serialNo，流水号，字符型，必须
// authCode，验证码，字符型，必须，产生参见接口通用约定
// targetUid，被关注设计师、工长用户ID
// 响应数据
//
// {"respCode":"00","respMsg":"OK"}
import config from './config.class'
export default class shareWeb {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.shareWebAdd = config.SERVERADD() + "/huihome/api/user/follow"
    this.shareWebAdd1 = config.SERVERADD() + "/huihome/api/user/unfollow"
    this.defaultData = {}
  }

  request(param, type) {
    if (type == '0'||type == 0) {
      return this.VC.$http.post(this.shareWebAdd1, param)
    } else {
      return this.VC.$http.post(this.shareWebAdd, param)
    }
  }
}
