import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/dynamic/comments"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid }&pdid=${param.pdid}&pageIndex=${param.pageIndex}&pageSize=${param.pageSize}`
    return this.VC.$http.get(DateUrl)
  }
}
