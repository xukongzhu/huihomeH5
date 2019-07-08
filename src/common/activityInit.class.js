import config from './config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/active/init"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?type=${param.type }&shareUrl=${encodeURIComponent(param.shareUrl)}`
    if (param.shareUid) {
      DateUrl += `&shareUid=${param.shareUid}`
    }
    return this.VC.$http.get(DateUrl)
  }
}
