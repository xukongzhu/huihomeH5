import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.Add = config.SERVERADD() + "/huihome/api/comment/commentItem"
    this.defaultData = {}
  }
  request(param) {
    let DateUrl = `${this.Add}?uid=${param.uid }&datatype=${param.datatype}&cmtid=${param.cmtid}&subCmtCount=${param.subCmtCount}`
    return this.VC.$http.get(DateUrl)
  }
}
