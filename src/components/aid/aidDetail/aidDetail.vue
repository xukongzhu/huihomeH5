<template>
    <div class="aidDetail">
        <menuTop v-if="!aidDetail.question||aidDetail.question.dynaImages.length<=0||aidDetail.question.dynaImages[0].mediaType != '1'" :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <detailVideo v-if="aidDetail.question&&aidDetail.question.dynaImages.length>0&&aidDetail.question.dynaImages[0].mediaType == '1'" ref="detailVideo" :item="aidDetail.question" :type="'6'" @count="count"></detailVideo>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" :style="aidDetail.question&&aidDetail.question.dynaImages.length>0&&aidDetail.question.dynaImages[0].mediaType == '1'?'padding-top:8.83rem':''" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore">
                <aidTop v-if="aidDetail.question" :extradata="extradata" :item="aidDetail.question">
                </aidTop>
                <div class="acceptAnswer" v-if="aidDetail.acceptAnswer">
                    <dynamic ref="dynamic" @count="count" :accept="'accept'" :from="'list'" :type="'6'" :item="aidDetail.acceptAnswer"></dynamic>
                </div>
                <div class="anser">
                    <div class="anser-screen">
                        <div class="anser-option" :class="{'select':select=='AC'}" @click="answerList()">
                            <div></div>
                            <span>按时间排序</span>
                        </div>
                        <div class="anser-option" :class="{'select':select=='T'}" @click="answerList()">
                            <div></div>
                            <span>按赞同排序</span>
                        </div>
                    </div>
                    <div class="anser-list">
                        <dynamic ref="dynamic" v-for="(item,index) in aidDetail.answers" @adopt="adopt" @count="count" :from="'list'" :uid="aidDetail.question.uid" :type="'6'" :key="index" :index="index" :item="item" :acceptStatus="aidDetail.acceptStatus"></dynamic>
                    </div>
                </div>
            </mt-loadmore>
        </div>
        <div class="aid-bottom">
            <div @click="commentshow()">
                精彩的回答更容易赚取悬赏金哦！
            </div>
        </div>
        
        <commentTextarea ref="commentTextarea" v-show="answeriHide" @commentHides="commentHides" :comtxt="'精彩的回答更容易赚取悬赏金哦'" :aid="'aid'" :dataid="dataid" @answeriSend="answeriSend"></commentTextarea>
    </div>
</template>
<script>
import './aidDetail.scss'
import {
    Toast,
    Indicator,
} from 'mint-ui';
import config from '../../../common/config.class'
import utils from '../../../common/utils'
import menuTop from '../../assembly/menu/menu-top.vue'
import aidTop from '../../assembly/aidTop/aidTop'
import detailVideo from '../../assembly/detailVideo/detailVideo'
import anserDiv from '../../assembly/anserDiv/anserDiv'
import dynamic from '../../assembly/dynamic/dynamic'
import aidDetail from '../../../common/aid/aidDetail.class'
import aidAnswer from '../../../common/aid/aidAnswer.class'
import aidAnswerList from '../../../common/aid/aidAnswerList.class'
import commentTextarea from '../../assembly/commentTextarea/commentTextarea'
export default {
    data: function() {
        return {
            aidDetail: Object,
            extradata: Object,
            answeriHide: false,
            select: 'AC',
            dataid: ''
        }
    },
    created() {
        this.dataid = this.$route.query.aid
    },
    activated: function() {
        this.Init();
    },
    methods: {
        commentHides: function() {
            this.answeriHide = false;
        },
        Init: function() {
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let AD = new aidDetail(this)
            let reqParam1 = {
                uid: loginUser.userId || '-1',
                aid: this.$route.query.aid,
            }
            Indicator.open({
                text: '加载中...',
            });
            AD.request(reqParam1).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.aidDetail = res.body.body
                    this.extradata = JSON.parse(res.body.body.question.extradata)
                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/aidDetail?aid=' + this.$route.query.aid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/aidDetail?aid=' + this.$route.query.aid
                    }
                    utils.publicShare(this, res.body.body.question, shareUrl)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //dynamic组件点赞评论收藏事件返回主组件修改状态
        count: function(type, status, num) {
            if (type == 'favorite') {

            } else if (type == 'appraises') {
                if (status == 0) {
                    this.extradata.helpCount = parseInt(this.extradata.helpCount) - 1
                } else {
                    this.extradata.helpCount = parseInt(this.extradata.helpCount) + 1
                }
            } else if (type == 'comment') {

            }
        },
        commentshow: function() {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            this.answeriHide = true
        },
        answeriSend: function(msgTxt) {
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let AA = new aidAnswer(this)
            if (msgTxt == '') {
                Toast('评论内容不能为空')
                return
            }
            let reqParam1 = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                aid: this.$route.query.aid,
                msgtxt: msgTxt
            }
            Indicator.open({
                text: '提交中...',
            });
            AA.request(reqParam1).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    utils.vToast(res.body.respMsg, '回答成功');
                    this.extradata.ansCount = parseInt(this.extradata.ansCount) + 1
                    this.answeriHide = false
                    this.$refs.commentTextarea.clear()
                    this.aidDetail.answers.unshift(res.body.body)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        answerList: function() {
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let AS = new aidAnswerList(this)
            let reqParam1 = {
                uid: loginUser.userId || '-1',//loginUser.uid,
                aid: this.$route.query.aid,
                by: this.select
            }
            Indicator.open({
                text: '提交中...',
            });
            AS.request(reqParam1).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    console.log(res);
                    this.aidDetail.answers = res.body.body.answers
                    if (this.select == 'T') {
                        this.select = 'AC'
                    } else {
                        this.select = 'T'
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        adopt: function(data) {
            this.aidDetail = data
            this.extradata = JSON.parse(data.question.extradata)
            this.select = 'AC'
        },
        //下拉刷新
        loadTop: function() {
            this.Init();
            this.select = 'AC'
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
    },
    components: {
        aidTop,
        anserDiv,
        menuTop,
        commentTextarea,
        dynamic,
        detailVideo
    },
    watch: {
        $route(to, from) {
            if (to.name == 'aidDetail' && from.name == 'aidDetail') {
                this.Init();
                this.select = 'AC'
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },
    }
}
</script>
