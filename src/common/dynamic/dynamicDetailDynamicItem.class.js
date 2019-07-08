import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/dynamic/detail/dynamicItem"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid }&dyid=${param.dyid}`
    if (param.withinDetail) {
      DateUrl += `&withinDetail=${param.withinDetail}`
    }
    return this.VC.$http.get(DateUrl)
  }
}
