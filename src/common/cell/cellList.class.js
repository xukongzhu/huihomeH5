import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/cell/list"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?pageIndex=${param.pageIndex}&pageSize=${param.pageSize}`
    return this.VC.$http.get(DateUrl)
  }
}
