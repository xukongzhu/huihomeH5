<template>
    <div class="aid-answer">
        <menuTop v-if="!aidDetail.question||aidDetail.question.dynaImages.length<=0||aidDetail.question.dynaImages[0].mediaType != '1'" :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <detailVideo v-if="aidDetail.question&&aidDetail.question.dynaImages.length>0&&aidDetail.question.dynaImages[0].mediaType == '1'" ref="detailVideo" :item="aidDetail.question" :type="'6'" @count="count"></detailVideo>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" :style="aidDetail.question&&aidDetail.question.dynaImages.length>0&&aidDetail.question.dynaImages[0].mediaType == '1'?'padding-top:8.83rem':''" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore">
                <aidTop v-if="aidDetail.question" :extradata="extradata" :item="aidDetail.question" :awardPoint="aidDetail.awardPoint" :expireTime="aidDetail.expireTime" :acceptStatus="aidDetail.acceptStatus">
                </aidTop>
                <dynamic :item="answers" ref="dynamic" @count="count">
                </dynamic>
            </mt-loadmore>
        </div>
        <detailBottom @workAppraise="appraise" @commentshow="commentShow" @workFavorite="favorite" :faHide="true" :appraiseType="appraiseStatus" :favoriteType="favStatus" :appraiseCount="answers.appraiseCount" :commentCount="answers.commentCount" :favoriteCount="answers.favCount">
        </detailBottom>

    </div>
</template>
<script>
import {
    Toast,
    Indicator,
} from 'mint-ui';
import './aidAnswer.scss'
import config from '../../../common/config.class'
import utils from '../../../common/utils'
import menuTop from '../../assembly/menu/menu-top.vue'
import detailVideo from '../../assembly/detailVideo/detailVideo'
import detailBottom from '../../assembly/detailBottom/detailBottom'
import aidAnswerItem from '../../../common/aid/aidAnswerItem.class'
import aidTop from '../../assembly/aidTop/aidTop'
import dynamic from '../../assembly/dynamic/dynamic'
export default {
    data() {
        return {
            aidDetail: Object,
            extradata: Object,
            answers: Object,
            appraiseStatus: 0,
            favStatus: 0,
        }
    },
    activated: function() {
        this.answerItem();
    },
    methods: {
        answerItem: function(ansid) {
            let AA = new aidAnswerItem(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId || '-1',//loginUser.serialNo,   
                ansid: this.$route.query.ansid,//loginUser.uid,
                withinDetail: '0'
            }
            Indicator.open({
                text: '加载中...',
            });
            AA.request(reqParamcom).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.aidDetail = res.body.body
                    this.answers = res.body.body.answers[0]
                    this.extradata = JSON.parse(res.body.body.question.extradata)
                    this.appraiseStatus = parseInt(res.body.body.answers[0].appraiseStatus)
                    this.favStatus = parseInt(res.body.body.answers[0].favStatus)
                    this.$refs.dynamic.Init(this.answers.id, '6');
                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/aidAnswer?ansid=' + this.$route.query.ansid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/aidAnswer?ansid=' + this.$route.query.ansid
                    }
                    utils.publicShare(this, res.body.body.answers[0], shareUrl)
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //dynamic组件点赞评论收藏事件返回主组件修改状态
        count: function(type, status, num) {
            if (type == 'favorite') {
                this.answers.favCount = num
                this.favStatus = status
            } else if (type == 'appraises') {
                this.answers.appraiseCount = num
                this.appraiseStatus = status
            } else if (type == 'comment') {
                this.answers.commentCount = num
            }
        },
        commentShow: function(cmtid, index) {
            this.$refs.dynamic.commentshow(cmtid, index);
        },
        favorite: function() {
            this.$refs.dynamic.favorite();
        },
        appraise: function() {
            this.$refs.dynamic.appraise();
        },
        loadTop: function() {
            this.answerItem();
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
    },
    components: {
        menuTop,
        aidTop,
        dynamic,
        detailBottom,
        detailVideo
    },
    watch: {
        $route(to, from) {
            if (to.name == 'aidAnswer' && from.name == 'aidAnswer') {
                this.answerItem();
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },
    }

}
</script>
