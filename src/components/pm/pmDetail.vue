<template>
    <div class="pmDetail">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <ruleDetailTop :topObj="topObj"></ruleDetailTop>
                <div class="pm-content">
                    <mt-navbar class="d1" v-model="selected">
                        <mt-tab-item class="d1-option" id="1">
                            评价
                            <span v-if="pmDetail3.accessCount">{{pmDetail3.accessCount}}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="2">
                            工地
                            <span v-if="pmDetail3.projCount">{{pmDetail3.projCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="3">
                            直播
                            <span v-if="pmDetail3.pdCount ">{{pmDetail3.pdCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                    </mt-navbar>
                    <mt-tab-container :swipeable="true" v-model="selected">
                        <mt-tab-container-item class="access-content" id="1">
                            <wordTop :item="pmDetailAssess"></wordTop>
                            <div v-if="pmDetailAssess.dynaItems&&pmDetailAssess.dynaItems.length>0">
                                <div v-for="(item,index) in pmDetailAssess.dynaItems" :key="index">
                                    <assesses :from="'list'" :selected="selected" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                </div>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item class="access-content" id="2">
                            <div v-if="pmDetailProj3&&pmDetailProj3.length>0">
                                <siteDiv v-for="(item,index) in pmDetailProj3" :from="'pm'" :item="item" :key="index"></siteDiv>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item class="access-content" id="3">
                            <div v-if="pmDetailDynamic&&pmDetailDynamic.length>0">
                                <div v-for="(item,index) in pmDetailDynamic " :key="index">
                                    <aidTop :from="'list'" :tab="'ass'" :index="index" v-if="item.datatype=='1'" :extradata="JSON.parse(item.extradata)" :item="item"></aidTop>
                                    <assesses :from="'list'" :tab="'ass'" :index="index" v-else-if="item.datatype=='3'" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                    <dynamic v-else ref="dynamic" :tab="'ass'" :index="index" :from="'list'" :dataid="item.id" :type="'1'" :item="item"></dynamic>
                                </div>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                    </mt-tab-container>
                </div>
                <toDesign :targetUid="pmDetail3.uid" :from="'pm'" :Share="Share"></toDesign>
            </mt-loadmore>
        </div>
    </div>
</template>
<script>
import './pmDetail.scss'
import {
    Toast,
    Indicator,
    Navbar,
    TabItem,
    TabContainer,
    TabContainerItem
} from 'mint-ui';
import utils from '../../common/utils'
import config from '../../common/config.class'
import pmDetail3 from '../../common/pm/pmDetail3.class'
import pmDetailProj3 from '../../common/pm/pmDetailProj3.class'
import pmDetailAssess from '../../common/user/userAssess.class'
import pmDetailDynamic from '../../common/owner/ownerDynamic.class'
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
            pmDetail3: {},
            pmDetailProj3: [],
            pmDetailAssess: {},
            pmDetailDynamic: [],
            dynamicLastId: '-1',
            topObj: Object,
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
            let PD = new pmDetail3(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '',
                pmid: this.$route.query.pmid,
                pageSize: '10',
                from: 'wap'
            }
            Indicator.open({
                text: '加载中...'
            });
            PD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.pmDetail3 = res.body.body
                    this.topObj = {
                        name: this.pmDetail3.username,
                        bannerImg: this.pmDetail3.mAvatar,
                        owneravatar: this.pmDetail3.avatar,
                        proveStatus: this.pmDetail3.followStatus,
                        huimiCount: this.pmDetail3.huimiCount || '0',
                        followCount: this.pmDetail3.followCount,
                        followedCount: this.pmDetail3.followedCount,
                        followStatus: this.pmDetail3.followStatus,
                        uid: this.pmDetail3.uid,
                        role: this.pmDetail3.rank,
                        expYear: this.pmDetail3.expYear,
                        cellId: this.pmDetail3.cellId,
                        cellName: this.pmDetail3.cellName,
                        city: this.pmDetail3.city,
                        totalScore: this.pmDetail3.totalScore
                    }
                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/pmDetail?pmid=' + this.$route.query.pmid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/pmDetail?pmid=' + this.$route.query.pmid
                    }
                    this.Share = {
                        shareUrl: shareUrl,
                        shareTitle: this.pmDetail3.shareTitle,
                        shareDigest: this.pmDetail3.shareDigest,
                        shareImage: this.pmDetail3.shareImage,
                        pageTitle: this.pmDetail3.shareTitle,
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
            let PD = new pmDetailDynamic(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.dynamicIndex = this.pageIndex.dynamicIndex + 1
            let reqParam = {
                uid: loginUser.userId || '-1',
                userid: this.$route.query.pmid,
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
                                this.pmDetailDynamic.push(res.body.body.dynaItems[i])
                            }
                        } else {
                            this.pmDetailDynamic = res.body.body.dynaItems
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
            let PA = new pmDetailAssess(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.AssessIndex = this.pageIndex.AssessIndex + 1
            let reqParam = {
                uid: loginUser.userId || '-1',
                userid: this.$route.query.pmid,
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
                        this.pmDetailAssess = res.body.body
                    } else {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.pmDetailAssess.dynaItems.push(res.body.body.dynaItems[i])
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
            let PP = new pmDetailProj3(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.projIndex = this.pageIndex.projIndex + 1
            let reqParam = {
                pmid: this.$route.query.pmid,
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
                                this.pmDetailProj3.push(res.body.body.projs[i])
                            }
                        }
                    } else {
                        this.pmDetailProj3 = res.body.body.projs
                    }
                } else {
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
            if (to.name == 'pmDetail' && from.name == 'pmDetail') {
                this.pageIndex.AssessIndex = 0
                this.pageIndex.projIndex = 0
                this.pageIndex.dynamicIndex = 0
                this.selected = '2'
                this.pmDetailProj3 = []
                this.pmDetailAssess = {}
                this.pmDetailDynamic = []
                this.active();
                this.Proj3();
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },
        selected: function(val) {
            if (val == '1') {
                if (JSON.stringify(this.pmDetailAssess) == '{}') {
                    this.assess();
                }
            } else if (val == '3') {
                if (this.pmDetailDynamic == '') {
                    this.dynamic();
                }
            }
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
