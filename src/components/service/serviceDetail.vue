<template>
    <div class="service-detail designerDetail">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <ruleDetailTop :topObj="topObj"></ruleDetailTop>
                <div class="designer-content">
                    <mt-navbar class="d1" v-model="selected">
                        <mt-tab-item class="d1-option" id="1">
                            评价
                            <span v-if="serviceDetail.accessCount">{{serviceDetail.accessCount}}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="2">
                            工地
                            <span v-if="serviceDetail.projCount">{{serviceDetail.projCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="3">
                            直播
                            <span v-if="serviceDetail.pdCount">{{serviceDetail.pdCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>

                    </mt-navbar>
                    <mt-tab-container :swipeable="true" v-model="selected">
                        <mt-tab-container-item class="access-content" id="1">
                            <wordTop :item="servieAssess"></wordTop>
                            <div v-if="servieAssess.dynaItems&&servieAssess.dynaItems.length>0">
                                <div v-for="(item,index) in servieAssess.dynaItems" :key="index">
                                    <assesses :from="'list'" :selected="selected" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                </div>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item class="access-content" id="2">
                            <div v-if="serviceProj&&serviceProj.length>0">
                                <siteDiv v-for="(item,index) in serviceProj" :item="item" :key="index"></siteDiv>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item class="access-content" id="3">
                            <div v-if="serviedynamic&&serviedynamic.length>0">
                                <div v-for="(item,index) in serviedynamic " :key="index">
                                    <aidTop :from="'list'" :tab="'ass'" :index="index" v-if="item.datatype=='1'" :extradata="JSON.parse(item.extradata)" :item="item"></aidTop>
                                    <assesses :from="'list'" :tab="'ass'" :index="index" v-else-if="item.datatype=='3'" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                    <dynamic v-else ref="dynamic" :tab="'ass'" :index="index" :from="'list'" :dataid="item.id" :type="'1'" :item="item"></dynamic>
                                </div>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                    </mt-tab-container>
                </div>
                <toDesign :targetUid="serviceDetail.uid" :Share="Share"></toDesign>
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
import '../designer/designerDetail.scss'
import utils from '../../common/utils'
import config from '../../common/config.class'
import serviceDetail from '../../common/service/serviceDetail.class'
import serviceProj from '../../common/service/serviceidDetailProj.class'
import servieAssess from '../../common/user/userAssess.class'
import ownerDynamic from '../../common/owner/ownerDynamic.class'
import menuTop from '../assembly/menu/menu-top.vue'
import ruleDetailTop from '../assembly/ruleDetailTop/ruleDetailTop'
import siteDiv from '../site/siteDiv/siteDiv'
import wordTop from '../assembly/word/wordTop'
import assesses from '../assembly/assesses/assesses'
import dynamic from '../assembly/dynamic/dynamic'
import myNone from '../my-none/my-none.vue'
import toDesign from '../assembly/toDesign/toDesign'
export default {
    data: function() {
        return {
            selected: '2',
            topObj: Object,
            serviceDetail: {},
            serviceProj: [],
            serviedynamic: [],
            servieAssess: {},
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
        this.proj();
    },
    methods: {
        active: function() {
            let SD = new serviceDetail(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '',
                serviceid: this.$route.query.serviceid,
                pageSize: '0',
                from: 'wap'
            }
            Indicator.open({
                text: '加载中...'
            });
            SD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.serviceDetail = res.body.body
                    this.topObj = {
                        name: this.serviceDetail.username,
                        bannerImg: this.serviceDetail.mAvatar,
                        owneravatar: this.serviceDetail.avatar,
                        proveStatus: this.serviceDetail.proveStatus,
                        huimiCount: this.serviceDetail.huimiCount,
                        followCount: this.serviceDetail.followCount,
                        followedCount: this.serviceDetail.followedCount,
                        followStatus: this.serviceDetail.followStatus,
                        uid: this.serviceDetail.uid,
                        role: this.serviceDetail.rank,
                        feeLow: this.serviceDetail.feeLow,
                        feeHigh: this.serviceDetail.feeHigh,
                        expYear: this.serviceDetail.expYear,
                        cellId: this.serviceDetail.cellId,
                        cellName: this.serviceDetail.cellName,
                        city: this.serviceDetail.city,
                        totalScore: this.serviceDetail.totalScore
                    }
                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/serviceDetail?serviceid=' + this.$route.query.serviceid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/serviceDetail?serviceid=' + this.$route.query.serviceid
                    }
                    this.Share = {
                        shareUrl: shareUrl,
                        shareTitle: this.serviceDetail.shareTitle,
                        shareDigest: this.serviceDetail.shareDigest,
                        shareImage: this.serviceDetail.shareImage,
                        pageTitle: this.serviceDetail.shareTitle,
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
        proj: function() {
            let SP = new serviceProj(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.projIndex = this.pageIndex.projIndex + 1
            let reqParam = {
                serviceid: this.$route.query.serviceid,
                pageSize: '10',
                pageIndex: this.pageIndex.projIndex,
            }
            Indicator.open({
                text: '加载中...'
            });
            SP.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.pageIndex.projIndex > 1) {
                        let start = res.body.body.projs.length;
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.serviceProj.push(res.body.body.projs[i])
                            }
                        }
                    } else {
                        this.serviceProj = res.body.body.projs
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
        assess: function() {
            let SA = new servieAssess(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.AssessIndex = this.pageIndex.AssessIndex + 1
            let reqParam = {
                uid: loginUser.userId || '-1',
                userid: this.$route.query.serviceid,
                pageIndex: this.pageIndex.AssessIndex,
                pageSize: '10',
            }
            Indicator.open({
                text: '加载中...'
            });
            SA.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    let start = res.body.body.dynaItems.length;
                    if (this.pageIndex.AssessIndex == 1) {
                        this.servieAssess = res.body.body
                    } else {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.servieAssess.dynaItems.push(res.body.body.dynaItems[i])
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
        dynamic: function() {

            let OD = new ownerDynamic(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.dynamicIndex = this.pageIndex.dynamicIndex + 1
            Indicator.open({
                text: '加载中...'
            });
            let reqParam = {
                uid: loginUser.userId || '',
                userid: this.$route.query.serviceid,
                asc: '',
                lastId: this.dynamicLastId,
                pageIndex: this.pageIndex.dynamicIndex,
                pageSize: '10',
                datatype: '-1',
            }
            OD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    let start = res.body.body.dynaItems.length;
                    if (start > 0) {
                        if (this.pageIndex.dynamicIndex > 1) {
                            for (let i = 0; i < start; i++) {
                                this.serviedynamic.push(res.body.body.dynaItems[i])
                            }
                        } else {
                            this.serviedynamic = res.body.body.dynaItems
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
        //刷新页面
        loadTop: function() {
            this.active();
            if (this.selected == '1') {
                this.pageIndex.AssessIndex = 0
                this.assess();
            } else if (this.selected == '2') {
                this.pageIndex.projIndex = 0
                this.proj();
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
                this.proj();
            } else if (this.selected == '3') {
                this.dynamic();
            }
        }
    },
    watch: {
        $route(to, from) {
            if (to.name == 'serviceDetail' && from.name == 'serviceDetail') {
                this.pageIndex.AssessIndex = 0
                this.pageIndex.projIndex = 0
                this.pageIndex.dynamicIndex = 0
                this.selected = '2'
                this.serviceProj = []
                this.serviedynamic = []
                this.servieAssess = {}
                this.active();
                this.proj();
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },
        selected: function(val) {
            if (val == '1') {
                if (JSON.stringify(this.servieAssess) == '{}') {
                    this.assess();
                }
            } else if (val == '3') {
                if (this.serviedynamic == '') {
                    this.dynamic();
                }
            }
        }
    },
    components: {
        ruleDetailTop,
        menuTop,
        siteDiv,
        wordTop,
        assesses,
        dynamic,
        myNone,
        toDesign
    }
}
</script>
