
import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD()+"/huihome/api/designer/detail/work3"
    this.defaultData = {
    }
  }
  request(param) {
    let DateUrl =`${this.Add}?designerid=${param.designerid}&pageSize=${param.pageSize}&pageIndex=${param.pageIndex}`
    return this.VC.$http.get(DateUrl)
  }
}

