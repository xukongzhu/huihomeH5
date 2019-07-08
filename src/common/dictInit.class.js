import config from './config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/dict/init"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?cate=${param.cate}`
    return this.VC.$http.get(DateUrl)
  }
}
