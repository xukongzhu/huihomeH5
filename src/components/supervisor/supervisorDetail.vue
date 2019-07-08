<template>
    <div class="supervisor-detail designerDetail">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <ruleDetailTop :topObj="topObj"></ruleDetailTop>
                <div class="designer-content">
                    <mt-navbar class="d1" v-model="selected">
                        <mt-tab-item class="d1-option" id="1">
                            评价
                            <span v-if="supDetail3.accessCount">{{supDetail3.accessCount}}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="2">
                            工地
                            <span v-if="supDetail3.projCount">{{supDetail3.projCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="3">
                            直播
                            <span v-if="supDetail3.pdCount ">{{supDetail3.pdCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                    </mt-navbar>
                    <mt-tab-container :swipeable="true" v-model="selected">
                        <mt-tab-container-item class="access-content" id="1">
                            <wordTop :item="supDetailAssess"></wordTop>
                            <div v-if="supDetailAssess.dynaItems&&supDetailAssess.dynaItems.length>0">
                                <div v-for="(item,index) in supDetailAssess.dynaItems" :key="index">
                                    <assesses :from="'list'" :selected="selected" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                </div>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item class="access-content" id="2">
                            <div v-if="supDetailProj3&&supDetailProj3.length>0">
                                <siteDiv v-for="(item,index) in supDetailProj3 " :item="item" :key="index"></siteDiv>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item class="access-content" id="3">
                            <div v-if="supDetailDynamic&&supDetailDynamic.length>0">
                                <div v-for="(item,index) in supDetailDynamic " :key="index">
                                    <aidTop :from="'list'" :tab="'ass'" :index="index" v-if="item.datatype=='1'" :extradata="JSON.parse(item.extradata)" :item="item"></aidTop>
                                    <assesses :from="'list'" :tab="'ass'" :index="index" v-else-if="item.datatype=='3'" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                    <dynamic v-else ref="dynamic" :tab="'ass'" :index="index" :from="'list'" :dataid="item.id" :type="'1'" :item="item"></dynamic>
                                </div>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                    </mt-tab-container>
                </div>
                <toDesign :targetUid="supDetail3.uid" :Share="Share"></toDesign>
            </mt-loadmore>
        </div>
    </div>
</template>
<script>
import {
    Toast,
    Navbar,
    Indicator,
    TabItem,
    TabContainer,
    TabContainerItem
} from 'mint-ui';
import '../designer/designerDetail.scss'
import utils from '../../common/utils'
import config from '../../common/config.class'
import supDetail3 from '../../common/supervisor/supervisorDetail.class'
import supDetailProj3 from '../../common/supervisor/supervisorDetailProj.class'
import supDetailAssess from '../../common/user/userAssess.class'
import supDetailDynamic from '../../common/owner/ownerDynamic.class'
import ruleDetailTop from '../assembly/ruleDetailTop/ruleDetailTop'
import menuTop from '../assembly/menu/menu-top.vue'
import assesses from '../assembly/assesses/assesses'
import siteDiv from '../site/siteDiv/siteDiv'
import dynamic from '../assembly/dynamic/dynamic'
import wordTop from '../assembly/word/wordTop'
import myNone from '../my-none/my-none.vue'
import toDesign from '../assembly/toDesign/toDesign'
export default {
    data: function() {
        return {
            selected: '2',
            supDetail3: {},
            supDetailProj3: [],
            supDetailAssess: {},
            supDetailDynamic: [],
            topObj: Object,
            dynamicLastId: '-1',
            pageIndex: {
                dynamicIndex: 0,
                AssessIndex: 0,
                projIndex: 0,
            },
            Share: Object
        }
    },
    activated: function() {
        this.active();
        this.Proj3();
    },
    methods: {
        active: function() {
            let PD = new supDetail3(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '-1',
                supervisorid: this.$route.query.supervisorid,
                pageSize: '10',
                from: 'wap'
            }
            Indicator.open({
                text: '加载中...'
            });
            PD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.supDetail3 = res.body.body
                    this.topObj = {
                        name: this.supDetail3.username,
                        bannerImg: this.supDetail3.mAvatar,
                        owneravatar: this.supDetail3.avatar,
                        proveStatus: this.supDetail3.followStatus,
                        huimiCount: this.supDetail3.huimiCount || '0',
                        followCount: this.supDetail3.followCount,
                        followedCount: this.supDetail3.followedCount,
                        followStatus: this.supDetail3.followStatus,
                        uid: this.supDetail3.uid,
                        role: this.supDetail3.rank,
                        expYear: this.supDetail3.expYear,
                        cellId: this.supDetail3.cellId,
                        cellName: this.supDetail3.cellName,
                        city: this.supDetail3.city,
                        totalScore: this.supDetail3.totalScore
                    }
                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/supervisorDetail?supervisorid=' + this.$route.query.supervisorid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/supervisorDetail?supervisorid=' + this.$route.query.supervisorid
                    }

                    this.Share = {
                        shareUrl: shareUrl,
                        shareTitle: this.supDetail3.shareTitle,
                        shareDigest: this.supDetail3.shareDigest,
                        shareImage: this.supDetail3.shareImage,
                        pageTitle: this.supDetail3.shareTitle,
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
        dynamic: function() {
            let PD = new supDetailDynamic(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.dynamicIndex = this.pageIndex.dynamicIndex + 1
            let reqParam = {
                uid: loginUser.userId || '',
                userid: this.$route.query.supervisorid,
                asc: '',
                lastId: this.dynamicLastId,
                pageIndex: this.pageIndex.dynamicIndex,
                pageSize: '10',
                datatype: '-1',
            }
            Indicator.open({
                text: '加载中...'
            });
            PD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    let start = res.body.body.dynaItems.length;
                    if (start > 0) {
                        if (this.pageIndex.dynamicIndex > 1) {
                            for (let i = 0; i < start; i++) {
                                this.supDetailDynamic.push(res.body.body.dynaItems[i])
                            }
                        } else {
                            this.supDetailDynamic = res.body.body.dynaItems
                        }
                        this.dynamicLastId = res.body.body.dynaItems[res.body.body.dynaItems.length - 1].id
                    }
                } else {
                    Toast(res.body.respMsg)
                }
                if (this.pageIndex.dynamicIndex > 1) {
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded();
                    }, 500)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        assess: function() {
            let PA = new supDetailAssess(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.AssessIndex = this.pageIndex.AssessIndex + 1
            let reqParam = {
                uid: loginUser.userId || '-1',
                userid: this.$route.query.supervisorid,
                pageIndex: this.pageIndex.AssessIndex,
                pageSize: '10',
            }
            Indicator.open({
                text: '加载中...'
            });
            PA.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    let start = res.body.body.dynaItems.length;
                    if (this.pageIndex.AssessIndex == 1) {
                        this.supDetailAssess = res.body.body
                    } else {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.supDetailAssess.dynaItems.push(res.body.body.dynaItems[i])
                            }
                        }
                    }
                } else {
                    Toast(res.body.respMsg)
                }
                if (this.pageIndex.AssessIndex > 1) {
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded();
                    }, 500)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })


        },
        Proj3: function() {
            let PP = new supDetailProj3(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.projIndex = this.pageIndex.projIndex + 1
            let reqParam = {
                supervisorid: this.$route.query.supervisorid,
                pageSize: '10',
                pageIndex: this.pageIndex.projIndex,
            }
            Indicator.open({
                text: '加载中...'
            });
            PP.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.pageIndex.projIndex > 1) {
                        let start = res.body.body.projs.length;
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.supDetailProj3.push(res.body.body.projs[i])
                            }
                        }
                    } else {
                        this.supDetailProj3 = res.body.body.projs
                    }
                }
                else {
                    Toast(res.body.respMsg)
                }
                if (this.pageIndex.projIndex > 1) {
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded();
                    }, 500)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //刷新页面
        loadTop: function() {
            this.active();
            if (this.selected == '1') {
                this.pageIndex.AssessIndex = 0
                this.assess();
            } else if (this.selected == '2') {
                this.pageIndex.projIndex = 0
                this.Proj3();
            } else if (this.selected == '3') {
                this.pageIndex.dynamicIndex = 0
                this.dynamic();
            }
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
        //加载更多
        infinite: function() {
            if (this.selected == '1') {
                this.assess();
            } else if (this.selected == '2') {
                this.Proj3();
            } else if (this.selected == '3') {
                this.dynamic();
            }
        }
    },
    watch: {
        $route(to, from) {
            if (to.name == 'supervisorDetail' && from.name == 'supervisorDetail') {
                this.pageIndex.AssessIndex = 0
                this.pageIndex.projIndex = 0
                this.pageIndex.dynamicIndex = 0
                this.selected = '2'
                this.supDetailProj3 = []
                this.supDetailAssess = {}
                this.supDetailDynamic = []
                this.active();
                this.Proj3();
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },
        selected: function(val) {
            if (val == '1') {
                if (JSON.stringify(this.supDetailAssess) == '{}') {
                    this.assess();
                }
            } else if (val == '3') {
                if (this.supDetailDynamic == '') {
                    this.dynamic();
                }
            }
            // this.done1//每次切换tab的时候初始化加载更多方法
        }
    },
    components: {
        Navbar,
        TabItem,
        TabContainer,
        TabContainerItem,
        ruleDetailTop,
        assesses,
        siteDiv,
        dynamic,
        menuTop,
        myNone,
        wordTop,
        toDesign
    }
}
</script>
