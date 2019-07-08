import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/aid2/answerItem"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid }&ansid=${param.ansid }&withinDetail=${param.withinDetail }`
    return this.VC.$http.get(DateUrl)
  }
}
