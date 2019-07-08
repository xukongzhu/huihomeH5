import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/supervisor/detail"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid }&supervisorid=${param.supervisorid}&pageSize=${param.pageSize}&from=${param.from}`
    return this.VC.$http.get(DateUrl)
  }
}
