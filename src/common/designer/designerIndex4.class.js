import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/designer/index4"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?cates=${param.cates}&sortBy=${param.sortBy}&uid=${param.uid}&pageSize=${param.pageSize}&pageIndex=${param.pageIndex}`
    return this.VC.$http.get(DateUrl)
  }
}
