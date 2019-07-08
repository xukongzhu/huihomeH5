<template>
    <div class="work-detail">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore">
                <div class="work-title">{{workinfo3.workname }}</div>
                <div class="work-type">
                    <span v-if="workinfo3.houseArea=='不定'">#未知#</span>
                    <span v-else>#{{workinfo3.houseArea}}㎡#</span>
                    <span>{{workinfo3.houseType}}</span>
                    <span>{{workinfo3.decoStyle}}</span>
                </div>
                <div class="work-data">
                    <img src="../../images/read.png" />
                    <span>{{workinfo3.clickCount}}</span>
                    <img src="../../images/icon_zan.png" />
                    <span>{{workinfo3.appraiseCount}}</span>
                    <img src="../../images/shoucangshu.png" />
                    <span>{{workinfo3.favoriteCount}}</span>
                    <img src="../../images/icon_pinglun.png" />
                    <span>{{workinfo3.commentCount}}</span>
                    <img src="../../images/icon_fenxiang.png" />
                    <span>{{workinfo3.shareCount}}</span>
                </div>
                <div class="work-design-infor" :designer-id="workinfo3.designerid">
                    <img @click="todesign(workinfo3.designerid )" :src="workinfo3.avatar||avatarDefault" />
                    <div>
                        <p>{{workinfo3.designername}}</p>
                        <p>
                            <span>擅长风格/</span>{{workinfo3.designerStyle}}</p>
                    </div>
                </div>
                <div class="work-conent">
                    <div class="work-conent-title">
                        <div></div>
                        <p>引言</p>
                    </div>
                    <p class="work-introduction" v-html="Trim(workinfo3.description)"></p>
                    <div class="work-detail-list" v-if="workinfo3.detailItems">
                        <div v-for="(item,index) in workinfo3.detailItems" :key="index">
                            <img class="preview-img" :src="item.listImg" @click="$preview.open(index,imgList)" />
                            <p>
                                <span>【{{index+1}}】</span>
                                <span v-html="Trim(item.description)"></span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="work-design-infor2">
                    <img @click="todesign(workinfo3.designerid )" :src="workinfo3.avatar||avatarDefault" />
                    <div class="user-data">
                        <div class="user-infor">
                            <div>
                                <p>
                                    <span>{{workinfo3.designername}}</span>/设计师</p>
                                <stars :starsObj="{score:workinfo3.totalScore ,maxScore:5}"></stars>
                            </div>
                            <div v-if="workinfo3.cellId" @click="toCell(workinfo3.cellId)" class="design-cell">
                                {{workinfo3.cellName}}
                            </div>
                        </div>
                        <div class="design-fee">
                            <img src="./img/icon_shoufei.png" />
                            <p>{{workinfo3.feeLow}}-{{workinfo3.feeHigh}}元/㎡</p>
                            <img src="./img/icon_congye.png" />
                            <p>从业经验&nbsp;&nbsp;&nbsp;{{workinfo3.expYear}}年</p>
                        </div>
                    </div>
                </div>
                <div class="work-similar">
                    <div class="work-similar-title" v-if="workinfo3.likelyWorks!=''">
                        <div></div>
                        <p>类似案例推荐</p>
                    </div>
                    <div class="work-similar-list">
                        <div class="work-similar-div" @click="toWork(item.id )" v-for="(item,index) in workinfo3.likelyWorks" :key="index">
                            <div class="work-similar-img" :style="'background-image: url('+item.coverimg+')'">
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
                <div class="designer-similar" v-if="workinfo3.likelyDesigners!=''">
                    <div class="designer-similar-title">
                        <div></div>
                        <p>相关设计师推荐</p>
                    </div>
                    <div class="designer-similar-list">
                        <div v-for="(item,index) in workinfo3.likelyDesigners" :key="index" @click="todesign(item.designerid)">
                            <img :src="item.designerAvatar" />
                            <p>{{item.designerName}}</p>
                            <p>擅长·{{item.decoStyle}}</p>
                        </div>
                    </div>
                </div>
                <div class="work-comment">
                    <div class="work-comment-title">
                        <div></div>
                        <p>评论 {{workinfo3.commentCount }}</p>
                    </div>
                    <commentList ref="commentList" :item="workinfo3"></commentList>

                </div>
                <bottomLoad></bottomLoad>
                <toDesign :targetUid="workinfo3.designerid" :from="'desi'" :Share="Share"></toDesign>
            </mt-loadmore>
        </div>
        <detailBottom @workAppraise="workAppraise" @commentshow="commentshow" @workFavorite="workFavorite" :appraiseType="appraiseType" :favoriteType="favoriteType" :appraiseCount="workinfo3.appraiseCount" :commentCount="workinfo3.commentCount" :favoriteCount="workinfo3.favoriteCount">
        </detailBottom>
    </div>
</template>

<script>
import './detail.scss'
import commentList from '../../assembly/commentList/commentList'
import detailBottom from '../../assembly/detailBottom/detailBottom'
import workinfo3 from '../../../common/work/workinfo3.class'
import workAppraise from '../../../common/work/workAppraise.class'
import workComment from '../../../common/work/workComment.class'
import workFavorite from '../../../common/userFavorite.class'
import stars from '../../assembly/stars/stars'
import config from '../../../common/config.class'
import menuTop from '../../assembly/menu/menu-top'
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
            workinfo3: Object,
            favoriteType: 0,
            appraiseType: 0,
            Share: Object,
            imgList: [],
            avatarDefault: require('../../images/default_head.png'),
        }
    },
    activated: function() {
        this.Init()
    },
    methods: {
        Trim: function(str) {  //str表示要转换的字符串
            return utils.Trim(str)
        },

        //输入框显示事件
        commentshow: function(cmtid, index) {
            this.$refs.commentList.commentshow(cmtid, index)
        },

        Init: function() {
            let WK = new workinfo3(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '',
                workid: this.$route.query.workid
            }
            Indicator.open({
                text: '加载中...',
            });
            WK.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.workinfo3 = res.body.body
                    this.favoriteType = parseInt(res.body.body.favFlag)
                    this.appraiseType = parseInt(res.body.body.appraised)
                    this.$refs.commentList.Init(this.workinfo3.workid, '2');
                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/workDetail?workid=' + this.$route.query.workid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/workDetail?workid=' + this.$route.query.workid
                    }
                    for (let i = 0; i < res.body.body.detailItems.length; i++) {
                        this.imgList.push({ 'src': res.body.body.detailItems[i].listImg, 'w': res.body.body.detailItems[i].width, 'h': res.body.body.detailItems[i].height })
                    }
                    this.Share = {
                        shareUrl: shareUrl,
                        shareTitle: this.workinfo3.shareTitle,
                        shareDigest: this.workinfo3.shareDigest,
                        shareImage: this.workinfo3.shareImage,
                        pageTitle: this.workinfo3.shareTitle,
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
                dataid: this.$route.query.workid,
                datatype: '2'
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
                        this.workinfo3.favoriteCount = parseInt(this.workinfo3.favoriteCount) + 1
                    } else {
                        this.favoriteType = 0
                        utils.vToast(res.body.respMsg, '取消收藏成功')
                        this.workinfo3.favoriteCount = parseInt(this.workinfo3.favoriteCount) - 1
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //相似作品跳转
        toWork: function(id) {
            this.$router.push({
                name: 'workDetail',
                // params: {
                //     workid: id
                // },
                query: {
                    workid: id
                }
            })
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
                workid: this.$route.query.workid
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
                        this.workinfo3.appraiseCount = parseInt(this.workinfo3.appraiseCount) + 1
                    } else {
                        utils.vToast(res.body.respMsg, '取消点赞成功')
                        this.appraiseType = 0
                        this.workinfo3.appraiseCount = parseInt(this.workinfo3.appraiseCount) - 1
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },

        getUrlParam: function(num) {
            if (parseInt(num) < 100) {
                return num
            } else {
                return '99+'
            }
        },
        //刷新
        loadTop: function() {
            this.imgList = []
            this.Init()
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
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
            if (to.name == 'workDetail' && from.name == 'workDetail') {
                this.imgList = []
                this.Init()
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },

    }
}
</script>