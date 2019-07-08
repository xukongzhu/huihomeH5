<template>
    <div class="designerDetail">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <ruleDetailTop :topObj="topObj"></ruleDetailTop>
                <div class="designer-content">
                    <mt-navbar class="d1" v-model="selected">
                        <mt-tab-item class="d1-option" id="1">
                            评价
                            <span v-if="designerDetail3.accessCount">{{designerDetail3.accessCount}}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="2">
                            工地
                            <span v-if="designerDetail3.projCount">{{designerDetail3.projCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="3">
                            作品
                            <span v-if="designerDetail3.worksCount">{{designerDetail3.worksCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="4">
                            直播
                            <span v-if="designerDetail3.pdCount ">{{designerDetail3.pdCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                    </mt-navbar>
                    <mt-tab-container :swipeable="true" v-model="selected">
                        <mt-tab-container-item class="access-content" id="1">
                            <wordTop :item="designerDetailAssess"></wordTop>
                            <div v-if="designerDetailAssess.dynaItems&&designerDetailAssess.dynaItems.length>0">
                                <div v-for="(item,index) in designerDetailAssess.dynaItems" :key="index">
                                    <assesses :from="'list'" :selected="selected" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                </div>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item class="access-content" id="2">
                            <div v-if="designerDetailproj&&designerDetailproj.length>0">
                                <siteDiv v-for="(item,index) in designerDetailproj" :item="item" :key="index"></siteDiv>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item class="access-content" id="3">
                            <div v-if="designerDetailwork3&&designerDetailwork3.length>0">
                                <workDiv v-for="(item,index) in designerDetailwork3" :item="item" :key="index"></workDiv>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item class="access-content" id="4">
                            <div v-if="designerDetaildynamic3&&designerDetaildynamic3.length>0">
                                <div v-for="(item,index) in designerDetaildynamic3 " :key="index">
                                    <aidTop :from="'list'" :tab="'ass'" :index="index" v-if="item.datatype=='1'" :extradata="JSON.parse(item.extradata)" :item="item"></aidTop>
                                    <assesses :from="'list'" :tab="'ass'" :index="index" v-else-if="item.datatype=='3'" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                    <dynamic v-else ref="dynamic" :tab="'ass'" :index="index" :from="'list'" :dataid="item.id" :type="'1'" :item="item"></dynamic>
                                </div>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                    </mt-tab-container>
                </div>
                <toDesign :targetUid="designerDetail3.designerid" :from="'desi'" :Share="Share"></toDesign>
            </mt-loadmore>
        </div>

    </div>
</template>
<script>
import {
    Toast,
    Indicator,
    Navbar,
    TabItem,
    TabContainer,
    TabContainerItem,
} from 'mint-ui';
import Vue from 'vue'
import './designerDetail.scss'
import utils from '../../common/utils'
import config from '../../common/config.class'
import designerDetail3 from '../../common/designer/designerDetail3.class'
import designerDetailAssess from '../../common/user/userAssess.class'
import designerDetailproj from '../../common/designer/designerDetailproj.class'
import designerDetaildynamic3 from '../../common/designer/designerDetaildynamic3.class'
import designerDetailwork3 from '../../common/designer/designerDetailWork3.class'
import ownerDynamic from '../../common/owner/ownerDynamic.class'
import ruleDetailTop from '../assembly/ruleDetailTop/ruleDetailTop'
import menuTop from '../assembly/menu/menu-top.vue'
import assesses from '../assembly/assesses/assesses'
import workDiv from '../work/workDiv/workDiv'
import siteDiv from '../site/siteDiv/siteDiv'
import dynamic from '../assembly/dynamic/dynamic'
import wordTop from '../assembly/word/wordTop'
import myNone from '../my-none/my-none.vue'
import toDesign from '../assembly/toDesign/toDesign'
export default {
    data: function() {
        return {
            selected: '3',
            designerDetail3: {},
            designerDetailAssess: {},
            designerDetailproj: [],
            designerDetaildynamic3: [],
            designerDetailwork3: [],
            topObj: Object,
            dynamicLastId: '-1',
            pageIndex: {
                workIndex: 0,
                dynamicIndex: 0,
                AssessIndex: 0,
                projIndex: 0,
            },
            Share: Object
        }
    },
    activated: function() {
        this.work3();
        this.active();
    },
    methods: {
        active: function() {
            let DD = new designerDetail3(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '',
                designerid: this.$route.query.designerid,
                pageSize: '10',
                from: 'wap'
            }
            Indicator.open({
                text: '加载中...'
            });
            DD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.designerDetail3 = res.body.body
                    this.topObj = {
                        name: this.designerDetail3.designername,
                        bannerImg: this.designerDetail3.mAvatar,
                        owneravatar: this.designerDetail3.avatar,
                        proveStatus: this.designerDetail3.proveStatus,
                        huimiCount: this.designerDetail3.huimiCount,
                        followCount: this.designerDetail3.followCount,
                        followedCount: this.designerDetail3.followedCount,
                        followStatus: this.designerDetail3.followStatus,
                        uid: this.designerDetail3.designerid,
                        role: this.designerDetail3.rank,
                        feeLow: this.designerDetail3.feeLow,
                        feeHigh: this.designerDetail3.feeHigh,
                        expYear: this.designerDetail3.expYear,
                        cellId: this.designerDetail3.cellId,
                        cellName: this.designerDetail3.cellName,
                        city: this.designerDetail3.city,
                        totalScore: this.designerDetail3.totalScore
                    }
                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/designerDetail?designerid=' + this.$route.query.designerid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/designerDetail?designerid=' + this.$route.query.designerid
                    }
                    this.Share = {
                        shareUrl: shareUrl,
                        shareTitle: this.designerDetail3.shareTitle,
                        shareDigest: this.designerDetail3.shareDigest,
                        shareImage: this.designerDetail3.shareImage,
                        pageTitle: this.designerDetail3.shareTitle,
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
        work3: function() {
            let DW = new designerDetailwork3(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.workIndex = this.pageIndex.workIndex + 1
            let reqParam = {
                designerid: this.$route.query.designerid,
                pageIndex: this.pageIndex.workIndex,
                pageSize: '10',
            }
            Indicator.open({
                text: '加载中...'
            });
            DW.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    let start = res.body.body.workItems.length;
                    if (this.pageIndex.workIndex > 1) {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.designerDetailwork3.push(res.body.body.workItems[i])
                            }
                        }
                    } else {
                        this.designerDetailwork3 = res.body.body.workItems
                    }
                } else {
                    Toast(res.body.respMsg)
                }
                if (this.pageIndex.workIndex > 1) {
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded();
                    }, 500)
                }
            }).catch((e) => {

                Indicator.close();
                Toast(e);
            })

        },
        dynamic3: function() {
            let DD = new ownerDynamic(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.dynamicIndex = this.pageIndex.dynamicIndex + 1
            Indicator.open({
                text: '加载中...'
            });
            let reqParam = {
                uid: loginUser.userId || '-1',
                userid: this.$route.query.designerid,
                asc: '',
                lastId: this.dynamicLastId,
                pageIndex: this.pageIndex.dynamicIndex,
                pageSize: '10',
                datatype: '-1',
            }
            DD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    let start = res.body.body.dynaItems.length;
                    if (start > 0) {
                        if (this.pageIndex.dynamicIndex > 1) {
                            for (let i = 0; i < start; i++) {
                                this.designerDetaildynamic3.push(res.body.body.dynaItems[i])
                            }
                        } else {
                            this.designerDetaildynamic3 = res.body.body.dynaItems
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
        Assess: function() {
            let DA = new designerDetailAssess(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.AssessIndex = this.pageIndex.AssessIndex + 1
            let reqParam = {
                uid: loginUser.userId || '-1',
                userid: this.$route.query.designerid,
                pageIndex: this.pageIndex.AssessIndex,
                pageSize: '10',
            }
            Indicator.open({
                text: '加载中...'
            });
            DA.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    let start = res.body.body.dynaItems.length;
                    if (this.pageIndex.AssessIndex == 1) {
                        this.designerDetailAssess = res.body.body
                    } else {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.designerDetailAssess.dynaItems.push(res.body.body.dynaItems[i])
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
        proj: function() {
            let DP = new designerDetailproj(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.projIndex = this.pageIndex.projIndex + 1
            let reqParam = {
                designerid: this.$route.query.designerid,
                pageIndex: this.pageIndex.projIndex,
                pageSize: '10',
            }
            Indicator.open({
                text: '加载中...'
            });
            DP.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    console.log(res)
                    if (this.pageIndex.projIndex > 1) {
                        let start = res.body.body.projs.length;
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.designerDetailproj.push(res.body.body.projs[i])
                            }
                        }
                    } else {
                        this.designerDetailproj = res.body.body.projs;
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
        infinite: function() {
            if (this.selected == '1') {
                this.Assess();
            } else if (this.selected == '2') {
                this.proj();
            } else if (this.selected == '3') {
                this.work3();
            } else if (this.selected == '4') {
                this.dynamic3();
            }
        },
        //刷新页面
        loadTop: function() {
            this.active();
            if (this.selected == '1') {
                this.pageIndex.AssessIndex = 0
                this.Assess();
            } else if (this.selected == '2') {
                this.pageIndex.projIndex = 0
                this.proj();
            } else if (this.selected == '3') {
                this.pageIndex.workIndex = 0
                this.work3();
            } else if (this.selected == '4') {
                this.pageIndex.dynamicIndex = 0
                this.dynamic3();
            }
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
    },
    watch: {
        $route(to, from) {
            if (to.name == 'designerDetail' && from.name == 'designerDetail') {
                this.pageIndex.AssessIndex = 0
                this.pageIndex.projIndex = 0
                this.pageIndex.workIndex = 0
                this.pageIndex.dynamicIndex = 0
                this.selected = '3'
                this.designerDetailAssess = {}
                this.designerDetailproj = []
                this.designerDetaildynamic3 = []
                this.designerDetailwork3 = []
                this.active();
                this.work3();
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },
        selected: function(val) {
            if (val == '1') {
                if (JSON.stringify(this.designerDetailAssess) == '{}') {
                    this.Assess();
                }
            } else if (val == '2') {
                if (this.designerDetailproj == '') {
                    this.proj();
                }
            } else if (val == '4') {
                if (this.designerDetaildynamic3 == '') {
                    this.dynamic3();
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
        workDiv,
        siteDiv,
        dynamic,
        menuTop,
        wordTop,
        myNone,
        toDesign
    }
}
</script>
