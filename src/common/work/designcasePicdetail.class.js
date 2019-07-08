
import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.workinfo3Add = config.SERVERADD() + "/huihome/api/designcase/picdetail"
    this.defaultData = {
      
    }
  }
  request(param) {
    let assessAddUrl = `${this.workinfo3Add}?wdid=${param.wdid}`
    if (param.uid != '') {
      assessAddUrl += `&uid=${param.uid}`;
    }
    return this.VC.$http.get(assessAddUrl)
  }
}
