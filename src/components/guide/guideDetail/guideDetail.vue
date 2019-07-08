<template>
    <div class="guide-detail">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore">
                <div class="guide-content">
                    <p class="guide-title">{{guideDetail.title }}</p>
                    <p class="guide-username">作者：{{guideDetail.username}}</p>
                    <p class="rai_content" v-html="Trim(guideDetail.content)"></p>
                </div>
                <div class="guide-comment">
                    <div class="guide-comment-title">
                        <div></div>
                        <p>评论 {{guideDetail.commentCount }}</p>
                    </div>
                    <commentList ref="commentList" :item="guideDetail"></commentList>
                </div>
                <bottomLoad></bottomLoad>
            </mt-loadmore>
        </div>
        <detailBottom @workAppraise="workAppraise" @commentshow="commentshow" @workFavorite="workFavorite" :appraiseType="appraiseType" :favoriteType="favoriteType" :appraiseCount="guideDetail.appraiseCount" :commentCount="guideDetail.commentCount" :favoriteCount="guideDetail.favCount">
        </detailBottom>
    </div>
</template>
<script>
import {
    Toast,
    Indicator,
} from 'mint-ui';
import utils from '../../../common/utils'
import config from '../../../common/config.class'
import detailBottom from '../../assembly/detailBottom/detailBottom'
import bottomLoad from '../../assembly/bottomLoad/bottomLoad'
import commentList from '../../assembly/commentList/commentList'
import menuTop from '../../assembly/menu/menu-top.vue'
import guideDetail from '../../../common/guide/guideDetail.class'
import guideAppraise from '../../../common/guide/guideAppraise.class'
import userFavorite from '../../../common/userFavorite.class'
import './guideDetail.scss'
export default {
    data: function() {
        return {
            favoriteType: 0,
            appraiseType: 0,
            guideDetail: Object,
        }
    },
    activated() {
        this.Init();
    },
    methods: {
        Trim: function(str) { //str表示要转换的字符串
            return utils.Trim(str)
        },
        Init: function() {
            let GD = new guideDetail(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '-1',
                topicid: this.$route.query.topicid,
            }
            Indicator.open({
                text: '加载中...',
            });
            GD.request(reqParam).then((res) => {
                Indicator.close();
                console.log(res);
                if (res.body.respCode == "00") {
                    this.guideDetail = res.body.body
                    this.$refs.commentList.Init(this.guideDetail.id, '4');
                    this.favoriteType = parseInt(res.body.body.favFlag)
                    this.appraiseType = parseInt(res.body.body.appraiseFlag)
                    let shareUrl = ''
                    console.log(this.guideDetail)
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/guideDetail?topicid=' + this.$route.query.topicid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/guideDetail?topicid=' + this.$route.query.topicid
                    }
                    utils.publicShare(this, res.body.body, shareUrl)
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //输入框显示事件
        commentshow: function(cmtid, index) {
            this.$refs.commentList.commentshow(cmtid, index)
        },
        //收藏
        workFavorite: function() {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let WF = new userFavorite(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                dataid: this.$route.query.topicid,
                datatype: '3'
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
                        this.guideDetail.favCount = parseInt(this.guideDetail.favCount) + 1
                    } else {
                        this.favoriteType = 0
                        utils.vToast(res.body.respMsg, '取消收藏成功')
                        this.guideDetail.favCount = parseInt(this.guideDetail.favCount) - 1
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //点赞
        workAppraise: function() {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let GA = new guideAppraise(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                topicid: this.$route.query.topicid
            }
            Indicator.open({
                text: '提交中...',
            });
            GA.request(reqParamcom, this.appraiseType).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.appraiseType == 0) {
                        utils.vToast(res.body.respMsg, '点赞成功')
                        this.appraiseType = 1
                        this.guideDetail.appraiseCount = parseInt(this.guideDetail.appraiseCount) + 1
                    } else {
                        utils.vToast(res.body.respMsg, '取消点赞成功')
                        this.appraiseType = 0
                        this.guideDetail.appraiseCount = parseInt(this.guideDetail.appraiseCount) - 1
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        loadTop: function() {
            this.Init()
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
    },
    components: {
        menuTop,
        commentList,
        detailBottom,
        bottomLoad
    },
    watch: {
        $route(to, from) {
            if (to.name == 'guideDetail' && from.name == 'guideDetail') {
                this.Init()
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },
    }
}
</script>
