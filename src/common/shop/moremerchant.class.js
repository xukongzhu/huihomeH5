import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/merchant/moremerchant"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid }&projId=${param.projId}&pageSize=${param.pageSize}&pageIndex=${param.pageIndex}`
    return this.VC.$http.get(DateUrl)
  }
}
