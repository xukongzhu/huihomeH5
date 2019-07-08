import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/dynamic/liveIndex"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid }&cate=${param.cate}&step=${param.step}&lastId=${param.lastId}&pageIndex=${param.pageIndex}&pageSize=${param.pageSize}`
    return this.VC.$http.get(DateUrl)
  }
}
