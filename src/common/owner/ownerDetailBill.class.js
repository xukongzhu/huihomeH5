import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/owner/detail/bill"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid}&ownerid=${param.ownerid}&feeType=${param.feeType}`
    return this.VC.$http.get(DateUrl)
  }
}
