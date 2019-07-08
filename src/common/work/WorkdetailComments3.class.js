
import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.workinfo3Add = config.SERVERADD() + "/huihome/api/work/WorkdetailComments3"
    this.defaultData = {
      
    }
  }
  request(param) {
    let assessAddUrl = `${this.workinfo3Add}?wdid=${param.wdid}`
    return this.VC.$http.get(assessAddUrl)
  }
}
