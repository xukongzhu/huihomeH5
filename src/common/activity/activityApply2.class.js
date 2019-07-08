import config from '../config.class'
export default class shareWeb {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.shareWebAdd = config.SERVERADD() + "/huihome/community/activity/apply2"
    this.defaultData = {}
  }

  request(param, type) {
    return this.VC.$http.post(this.shareWebAdd, param)
  }
}
