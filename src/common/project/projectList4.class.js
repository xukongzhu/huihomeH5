
import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/project/list4"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?cates=${param.cates}&sortBy=${param.sortBy}&pageIndex=${param.pageIndex}&pageSize=${param.pageSize}}`
    return this.VC.$http.get(DateUrl)
  }
}
