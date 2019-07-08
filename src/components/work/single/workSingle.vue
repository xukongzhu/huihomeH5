<template>
    <div class="work-detail work-single">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore">
                <div class="work-conent">
                    <div class="work-detail-list">
                        <img :src="picdetail.imgUrl" />
                        <p>
                            <span v-html="Trim(picdetail.description)"></span>
                        </p>
                    </div>
                </div>
                <div class="single-work" v-if="picdetail.workInfo">
                    <div class="single-work-title">
                        <div></div>
                        <p>来自案例</p>
                    </div>
                    <div class="single-infor" @click="toworkDetail(picdetail.workInfo.workid)">
                        <div class="single-img" :style="'background-image: url('+picdetail.workInfo.coverimg+')'"></div>
                        <div class="single-infor-div">
                            <p>{{picdetail.workInfo.workname}}</p>
                            <div class="work-single-infor">
                                <span>{{picdetail.workInfo.decoStyle}}</span>
                                <div></div>
                                <span>{{picdetail.workInfo.houseType}}</span>
                            </div>
                            <div class="work-single-infor">
                                <span>{{picdetail.workInfo.houseArea||'0'}}m²</span>
                                <div></div>
                                <span>{{picdetail.workInfo.fee}}元/m²</span>
                            </div>
                            <div class="work-data">
                                <img src="../../images/read.png" />
                                <span>{{picdetail.workInfo.clickCount||'0'}}</span>
                                <img src="../../images/icon_zan.png" />
                                <span>{{picdetail.workInfo.appraiseCount||'0'}}</span>
                                <img src="../../images/shoucangshu.png" />
                                <span>{{picdetail.workInfo.favoriteCount||'0'}}</span>
                                <img src="../../images/icon_pinglun.png" />
                                <span>{{picdetail.workInfo.commentCount||'0'}}</span>
                                <img src="../../images/icon_fenxiang.png" />
                                <span>{{picdetail.workInfo.shareCount||'0'}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="work-design-infor2">
                    <img @click="todesign(picdetail.designerid )" :src="picdetail.avatar" />
                    <div class="user-data">
                        <div class="user-infor">
                            <div>
                                <p>
                                    <span>{{picdetail.designername}}</span>/设计师</p>
                                <stars :starsObj="{score:picdetail.totalScore ,maxScore:5}"></stars>
                            </div>
                            <div v-if="picdetail.cellId" @click="toCell(picdetail.cellId)" class="design-cell">
                                {{picdetail.cellName}}
                            </div>
                        </div>
                        <div class="design-fee">
                            <img src="../detail/img/icon_shoufei.png" />
                            <p>{{picdetail.feeLow}}-{{picdetail.feeHigh}}元/㎡</p>
                            <img src="../detail/img/icon_congye.png" />
                            <p>从业经验&nbsp;&nbsp;&nbsp;{{picdetail.expYear}}年</p>
                        </div>
                    </div>
                </div>
                <div class="work-similar">
                    <div class="work-similar-title" v-if="picdetail.likelyPics!=''">
                        <div></div>
                        <p>同类空间推荐</p>
                    </div>
                    <div class="work-similar-list">
                        <div class="work-similar-div" @click="toWork(item.wdId )" v-for="(item,index) in picdetail.likelyPics" :key="index">
                            <div class="work-similar-img" :style="'background-image: url('+item.imgUrl+')'">
                            </div>
                            <div class="work-similar-infor">
                                <p class="work-similar-name">{{item.workname}}</p>
                                <div>
                                    <img src="../../images/read.png" />
                                    <span>{{item.clickCount}}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="designer-similar" v-if="picdetail.likelyDesigners!=''">
                    <div class="designer-similar-title">
                        <div></div>
                        <p>相关设计师推荐</p>
                    </div>
                    <div class="designer-similar-list">
                        <div v-for="(item,index) in picdetail.likelyDesigners" :key="index" @click="todesign(item.designerid)">
                            <img :src="item.designerAvatar" />
                            <p>{{item.designerName}}</p>
                            <p>擅长·{{item.decoStyle}}</p>
                        </div>
                    </div>
                </div>
                <div class="work-comment">
                    <div class="work-comment-title">
                        <div></div>
                        <p>评论 {{picdetail.commentCount }}</p>
                    </div>
                    <commentList ref="commentList" :item="picdetail"></commentList>
                </div>

                <bottomLoad></bottomLoad>
                <toDesign :targetUid="picdetail.designerid" :from="'desi'" :Share="Share"></toDesign>
            </mt-loadmore>
        </div>
        <detailBottom @workAppraise="workAppraise" @commentshow="commentshow" @workFavorite="workFavorite" :appraiseType="appraiseType" :favoriteType="favoriteType" :appraiseCount="picdetail.appraiseCount" :commentCount="picdetail.commentCount" :favoriteCount="picdetail.favCount">
        </detailBottom>
    </div>
</template>

<script>
import './workSingle.scss'
import '../detail/detail.scss'
import commentList from '../../assembly/commentList/commentList'
import detailBottom from '../../assembly/detailBottom/detailBottom'
import picdetail from '../../../common/work/designcasePicdetail.class'
import workAppraise from '../../../common/work/workappraiseDetail.class'
import workFavorite from '../../../common/userFavorite.class'
import stars from '../../assembly/stars/stars.vue'
import config from '../../../common/config.class'
import menuTop from '../../assembly/menu/menu-top.vue'
import menuBottom from '../../assembly/menu/menu-bottom.vue'
import bottomLoad from '../../assembly/bottomLoad/bottomLoad'
import toDesign from '../../assembly/toDesign/toDesign'
import {
    Toast,
    Indicator
} from 'mint-ui'
import utils from '../../../common/utils'

export default {
    name: 'workDetail',
    data() {
        return {
            picdetail: Object,
            msgTxt: '',
            favoriteType: 0,
            appraiseType: 0,
            Share: Object,
        }
    },
    activated: function() {
        this.Init()
    },
    methods: {
        Trim: function(str) { //str表示要转换的字符串
            return utils.Trim(str)
        },
        Init: function() {
            let PD = new picdetail(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam1 = {
                uid: loginUser.userId || '',
                wdid: this.$route.query.wdid
            }
            Indicator.open({
                text: '加载中...',
            });
            PD.request(reqParam1).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.picdetail = res.body.body
                    this.favoriteType = parseInt(res.body.body.favStatus)
                    this.appraiseType = parseInt(res.body.body.appraiseStatus)
                    this.$refs.commentList.Init(this.picdetail.wdId, '3');
                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/workSingle?wdid=' + this.$route.query.wdid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/workSingle?wdid=' + this.$route.query.wdid
                    }
                    this.Share = {
                        shareUrl: shareUrl,
                        shareTitle: this.picdetail.shareTitle,
                        shareDigest: this.picdetail.shareDigest,
                        shareImage: this.picdetail.shareImage,
                        pageTitle: this.picdetail.shareTitle,
                    }
                    if (!utils.isLocalEnv()) {
                        utils.wxShare(this, this.Share)
                    } else {
                        utils.APPshare(this, this.Share)
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })

        },

        //跳转设计师详情
        todesign: function(id) {
            window.location.href = config.SERVERADD() + '/huihome/api/designer/detail/' + id + '.html'
        },
        //跳转工作室
        toCell: function(id) {
            window.location.href = config.SERVERADD() + '/huihome/api/cell/detail/' + id + '.html'
        },
        //收藏
        workFavorite: function() {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let WF = new workFavorite(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                dataid: this.$route.query.wdid,
                datatype: '2001'
            }
            Indicator.open({
                text: '提交中...',
            });
            WF.request(reqParamcom, this.favoriteType).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.favoriteType == 0) {
                        this.favoriteType = 1
                        utils.vToast(res.body.respMsg, '收藏成功')
                        this.picdetail.favCount = parseInt(this.picdetail.favCount) + 1
                    } else {
                        this.favoriteType = 0
                        utils.vToast(res.body.respMsg, '取消收藏成功')
                        this.picdetail.favCount = parseInt(this.picdetail.favCount) - 1
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //来自案例跳转
        toworkDetail: function(id) {
            this.$router.push({
                name: 'workDetail',
                query: {
                    workid: id
                }
            })
        },
        //相似作品跳转
        toWork: function(id) {
            this.$router.push({
                name: 'workSingle',
                // params: {
                //     workid: id
                // },
                query: {
                    wdid: id
                }
            })


        },
        //输入框显示事件
        commentshow: function(cmtid, index) {
            this.$refs.commentList.commentshow(cmtid, index)
        },


        //点赞
        workAppraise: function() {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let WA = new workAppraise(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                wdId: this.$route.query.wdid
            }
            Indicator.open({
                text: '提交中...',
            });
            WA.request(reqParamcom, this.appraiseType).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.appraiseType == 0) {
                        utils.vToast(res.body.respMsg, '点赞成功')
                        this.appraiseType = 1
                        this.picdetail.appraiseCount = parseInt(this.picdetail.appraiseCount) + 1
                    } else {
                        utils.vToast(res.body.respMsg, '取消点赞成功')
                        this.appraiseType = 0
                        this.picdetail.appraiseCount = parseInt(this.picdetail.appraiseCount) - 1
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //刷新
        loadTop: function() {
            this.Init()
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
        getUrlParam: function(num) {
            if (parseInt(num) < 100) {
                return num
            } else {
                return '99+'
            }
        },
    },
    components: {
        stars,
        menuTop,
        menuBottom,
        bottomLoad,
        toDesign,
        commentList,
        detailBottom
    },
    watch: {
        $route(to, from) {
            if (to.name == 'workSingle' && from.name == 'workSingle') {
                this.Init()
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        }
    }
}
</script>