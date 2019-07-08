import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/community/activity/applies"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?activityid=${param.activityid}&pageSize=${param.pageSize}&pageIndex=${param.pageIndex}`
    return this.VC.$http.get(DateUrl)
  }
}
