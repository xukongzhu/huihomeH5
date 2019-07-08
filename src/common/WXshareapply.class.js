//appid appid
//timestamp 时间戳
//nonceStr 随机串
//signature 参数
import config from './config.class'
export default class WXshareapply {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.WXshareAdd = config.SERVERADD()+"/huihome/api/oauth/wx/getTicket"
    this.defaultData = {
      appid: '',
      timestamp: '',
      nonceStr: "",
      signature: ""
    }
  }

  requestAndSetData(param) {
    let joinDataUrl = `${this.WXshareAdd}?url=${param.url}`
    return this.VC.$http.get(joinDataUrl)
  }
}
