<template>
    <div class="dynamicDetail">
        <menuTop v-if="!dynamicDetailDynamicItem.dynaImages||dynamicDetailDynamicItem.dynaImages.length<=0||dynamicDetailDynamicItem.dynaImages[0].mediaType != '1'" :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <detailVideo v-if="dynamicDetailDynamicItem.dynaImages &&dynamicDetailDynamicItem.dynaImages.length>0&&dynamicDetailDynamicItem.dynaImages[0].mediaType == '1'" ref="detailVideo" :item="dynamicDetailDynamicItem" :type="'1'" @count="count"></detailVideo>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" :style="dynamicDetailDynamicItem.dynaImages&&dynamicDetailDynamicItem.dynaImages.length>0&&dynamicDetailDynamicItem.dynaImages[0].mediaType == '1'?'padding-top:8.83rem':''" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore">
                <div class="dynamic">
                    <dynamic :item="dynamicDetailDynamicItem" :src="src" ref="dynamic" @count="count">
                    </dynamic>
                </div>
            </mt-loadmore>
        </div>
        <detailBottom @workAppraise="appraise" @commentshow="commentShow" @workFavorite="favorite" :faHide="dynamicDetailDynamicItem.datatype=='3'" :appraiseType="appraiseStatus" :favoriteType="favStatus" :appraiseCount="dynamicDetailDynamicItem.appraiseCount" :commentCount="dynamicDetailDynamicItem.commentCount" :favoriteCount="dynamicDetailDynamicItem.favCount">
        </detailBottom>
    </div>
</template>
<script>
import {
    Toast,
    Indicator,
} from 'mint-ui';
import Vue from 'vue'
import config from '../../../common/config.class'
import utils from '../../../common/utils'
import './dynamicDetail.scss'
import detailBottom from '../../assembly/detailBottom/detailBottom'
import detailVideo from '../../assembly/detailVideo/detailVideo'
import dynamic from '../../assembly/dynamic/dynamic'
import menuTop from '../../assembly/menu/menu-top.vue'
import bottomLoad from '../../assembly/bottomLoad/bottomLoad'
import dynamicDetailDynamicItem from '../../../common/dynamic/dynamicDetailDynamicItem.class'
import assessItem from '../../../common/dynamic/assessItem.class'
export default {
    data: function() {
        return {
            dynamicDetailDynamicItem: Object,
            appraiseStatus: 0,
            favStatus: 0,
            allLoaded: false,
            playerPlayingObj: Object,
            src: ""
        }
    },
    activated: function() {
        if (this.$route.query.dyid) {
            this.Init();
        } else if (this.$route.query.assessid) {
            this.assInit();
        }
    },
    methods: {
        playerPlaying: function(player) {
            this.playerPlayingObj = player
        },
        //评价详情初始化
        assInit: function() {
            let DDD = new assessItem(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '-1',
                assessid: this.$route.query.assessid,
                assessType: this.$route.query.assessType,
            }
            Indicator.open({
                text: '加载中...',
            });
            DDD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.dynamicDetailDynamicItem = res.body.body
                    this.appraiseStatus = parseInt(res.body.body.appraiseStatus)
                    this.favStatus = parseInt(res.body.body.favStatus)
                    let extradata = JSON.parse(this.dynamicDetailDynamicItem.extradata)
                    if (res.body.body.datatype == '3' && extradata.assessType == '2') {
                        this.$refs.dynamic.Init(res.body.body.dataid, '7');
                    } else if (res.body.body.datatype == '3' && (extradata.assessType == '0' || extradata.assessType == '1')) {
                        this.$refs.dynamic.Init(res.body.body.dataid, '8');
                    } else {
                        this.$refs.dynamic.Init(this.dynamicDetailDynamicItem.id, '1');
                    }
                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/dynamicDetail?assessid=' + this.$route.query.assessid + '&assessType=' + this.$route.query.assessType + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/dynamicDetail?assessid=' + this.$route.query.assessid + '&assessType=' + this.$route.query.assessType
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
        Init: function() {
            let DDD = new dynamicDetailDynamicItem(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '-1',
                dyid: this.$route.query.dyid,
            }
            Indicator.open({
                text: '加载中...',
            });
            DDD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.dynamicDetailDynamicItem = res.body.body
                    this.appraiseStatus = parseInt(res.body.body.appraiseStatus)
                    this.favStatus = parseInt(res.body.body.favStatus)
                    let extradata = JSON.parse(this.dynamicDetailDynamicItem.extradata)
                    if (res.body.body.datatype == '3' && extradata.assessType == '2') {
                        this.$refs.dynamic.Init(res.body.body.dataid, '7');
                    } else if (res.body.body.datatype == '3' && (extradata.assessType == '0' || extradata.assessType == '1')) {
                        this.$refs.dynamic.Init(res.body.body.dataid, '8');
                    } else {
                        this.$refs.dynamic.Init(this.dynamicDetailDynamicItem.id, '1');
                    }
                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/dynamicDetail?dyid=' + this.$route.query.dyid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/dynamicDetail?dyid=' + this.$route.query.dyid
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
        //dynamic组件点赞评论收藏事件返回主组件修改状态
        count: function(type, status, num) {
            if (type == 'favorite') {
                this.dynamicDetailDynamicItem.favCount = num
                this.favStatus = status
            } else if (type == 'appraises') {
                this.dynamicDetailDynamicItem.appraiseCount = num
                this.appraiseStatus = status
            } else if (type == 'comment') {
                this.dynamicDetailDynamicItem.commentCount = num
            }
        },
        //刷新页面
        loadTop: function() {
            this.commentIndex = 0
            if (this.$route.query.dyid) {
                this.Init();
            } else if (this.$route.query.assessid) {
                this.assInit();
            }
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },

        commentShow: function(cmtid, index) {
            this.$refs.dynamic.commentshow(cmtid, index);
        },
        favorite: function() {
            this.$refs.dynamic.favorite();
        },
        appraise: function() {
            this.$refs.dynamic.appraise();
        }
    },
    components: {
        dynamic,
        menuTop,
        bottomLoad,
        detailBottom,
        detailVideo
    },
    watch: {
        $route(to, from) {
            if (to.name == 'dynamicDetail') {
                this.commentIndex = 0
                this.dynamicDetailDynamicItem = {}
                if (this.$route.query.dyid) {
                    this.Init();
                } else if (this.$route.query.assessid) {
                    this.assInit();
                }
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },
        // playerPlayingObj(to, from) {
        //     console.log(from)
        // }
    }
}
</script>
