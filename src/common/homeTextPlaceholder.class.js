import config from './config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/home/textPlaceholder"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?usefor=${param.usefor}`
    return this.VC.$http.get(DateUrl)
  }
}
