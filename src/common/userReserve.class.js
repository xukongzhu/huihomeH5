// 响应数据
//
// {"respCode":"00","respMsg":"OK"}
import config from './config.class'
export default class shareWeb {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.shareWebAdd = config.SERVERADD() + "/huihome/api/user/reserve2"
    this.defaultData = {}
  }

  request(param) {
    return this.VC.$http.post(this.shareWebAdd, param)
  }
}
