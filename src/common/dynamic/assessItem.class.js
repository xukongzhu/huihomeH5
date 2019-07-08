import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/dynamic/detail/assessItem"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid}&assessid=${param.assessid}&assessType=${param.assessType}`
    return this.VC.$http.get(DateUrl)
  }
}
