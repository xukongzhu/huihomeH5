import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/subject/list2"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?pageIndex=${param.pageIndex}&pageSize=${param.pageSize}`
    if (param.name) {
      DateUrl += `&name=${param.name}`
    }
    return this.VC.$http.get(DateUrl)
  }
}
