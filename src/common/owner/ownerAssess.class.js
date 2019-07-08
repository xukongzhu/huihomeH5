
import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/owner/detail2/assess"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid }&ownerid=${param.ownerid}&targetRoleid=${param.targetRoleid}&asc=${param.asc}&pageIndex=${param.pageIndex}&pageSize=${param.pageSize}`
    return this.VC.$http.get(DateUrl)
  }
}
