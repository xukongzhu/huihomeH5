import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/community/activity/detail"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?activityid=${param.activityid}&uid=${param.uid}&serialNo=${param.serialNo}&authCode=${param.authCode}`
    return this.VC.$http.get(DateUrl)
  }
}
