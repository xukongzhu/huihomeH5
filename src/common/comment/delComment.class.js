import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/comment/delComment"
    this.defaultData = {}
  }

  request(param) {
    return this.VC.$http.post(this.Add, param)
  }
}
