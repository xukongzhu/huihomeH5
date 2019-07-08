import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/supervisor/detail/proj"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?pageIndex=${param.pageIndex }&supervisorid=${param.supervisorid}&pageSize=${param.pageSize}`
    return this.VC.$http.get(DateUrl)
  }
}
