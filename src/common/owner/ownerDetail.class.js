import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/owner/detail2"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid}&ownerid=${param.ownerid}&dynaCount=${param.dynaCount}&step=${param.step}`
    return this.VC.$http.get(DateUrl)
  }
}
