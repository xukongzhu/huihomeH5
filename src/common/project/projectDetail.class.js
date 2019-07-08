import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/project/detail2"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid}&dynaCount=${param.dynaCount}&step=${param.step}&projid=${param.projid}`
    return this.VC.$http.get(DateUrl)
  }
}
