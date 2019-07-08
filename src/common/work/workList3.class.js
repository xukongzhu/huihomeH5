import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.workinfo3Add = config.SERVERADD() + "/huihome/api/work/list3"
    this.defaultData = {

    }
  }
  request(param) {
    let assessAddUrl = `${this.workinfo3Add}?cates=${param.cates}&sortBy=${param.sortBy}&pageIndex=${param.pageIndex}&pageSize=${param.pageSize}`
    return this.VC.$http.get(assessAddUrl)
  }
}
