// uid，用户ID，整型，必须
// serialNo，流水号，字符型，必须
// authCode，验证码，字符型，必须，产生参见接口通用约定
// dyId，工地动态ID
// 响应数据
// {"respCode":"00","respMsg":"OK"}
import config from '../config.class'
export default class shareWeb {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.shareWebAdd = config.SERVERADD() + "/huihome/api/user/genverifycode2"
    this.defaultData = {}
  }

  request(param) {
    return this.VC.$http.post(this.shareWebAdd, param)
  }
}
