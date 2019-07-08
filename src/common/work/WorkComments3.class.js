// workid 设计师作品id
// comments 为评论列表数据
// id 评论id
// fromUid 评论发布用户id
// fromUsername 评论发布用户名
// fromRoleid 评论发布用户角色id
// fromAvatar 评论发布用户头像
// toUid 被评论发布用户id （如果为空，则表示评论；不为空，则表示被回复用户）
// toUsername 被评论发布用户名 （如果为空，则表示评论；不为空，则表示被回复用户）
// toRoleid 被评论发布用户角色id
// msgtxt 评论内容
// occurTime 评论时间
// occurTimeStr 评论格式化时间
// comments 回复列表（数据结构同评论）
// proveStatus 大V认证状态 -1 普通会员 0大V绘友
import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.workinfo3Add = config.SERVERADD() + "/huihome/api/work/WorkComments3"
    this.defaultData = {
      
    }
  }
  request(param) {
    let assessAddUrl = `${this.workinfo3Add}?workid=${param.workid}`
    if (param.pageIndex != '') {
      assessAddUrl += `&pageIndex=${param.pageIndex}`;
    }
    if (param.pageSize != '') {
      assessAddUrl += `&pageSize=${param.pageSize}`;
    }
    return this.VC.$http.get(assessAddUrl)
  }
}
