// workid 设计师作品id
// designerid 设计师id
// designername 设计师名
// avatar 设计师头像url
// designerStyle 设计师风格
// totalScore 评分
// designerStatus 设计师状态，0=显示底部设计师名片, -1=隐藏底部设计师名片
// feeLow 设计费低值
// feeHigh 设计费高值
// expYear 从业年数
// cellId 工作室ID
// cellName 工作室简称
// designermobile 设计师电话
// decoStyle 作品风格
// fee 作品设计费（每平米）
// village 小区
// houseType 户型
// houseArea 面积
// description 作品描述
// workname 作品名
// coverImg 作品封面图
// commentCount 评论数
// appraiseCount 点赞数
// favoriteCount 收藏数
// shareCount 分享数
// clickCount 点击数
// appraised 当前用户是否点赞, 1=已点赞
// favFlag 收藏标识，1=已收藏
// shareUrl 分享的页面url
// shareTitle 分享的标题
// shareDigest 分享的摘要
// shareImage 分享的图片
// detailItems 为作品的全部详情图片列表数据
// id 作品详情图片id
// workid 作品ID
// listImg 列表图片url
// description 列表图片说明
// appraiseCount 列表图片点赞数
// commentCount 列表图片评论数
// width 宽度
// height 高度
// likelyWorks 相似作品列表
// id 作品ID
// workname 作品名
// coverImg 作品封面图
// designerid 设计师id
// designername 设计师名
// designerAvatar 设计师头像url
// commentCount 评论数
// appraiseCount 点赞数
// shareCount 分享数
// clickCount 阅读数
// likelyDesigners 相关设计师推荐
// designerid 设计师id
// designerName 设计师名
// designerAvatar 设计师头像url
// decoStyle 设计师风格
import config from '../config.class'
export default class indexData {
  constructor(vueComponent, dataSet) {
    this.VC = vueComponent
    this.DS = dataSet
    this.workinfo3Add = config.SERVERADD()+"/huihome/api/work/workinfo3"
    this.defaultData = {

    }
  }
  request(param) {
    let assessAddUrl = `${this.workinfo3Add}?workid=${param.workid}`
    if (param.uid != '') {
      assessAddUrl += `&uid=${param.uid}`;
    }
    return this.VC.$http.get(assessAddUrl)
  }
}
