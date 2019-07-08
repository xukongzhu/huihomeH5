<template>
    <div class="ownerDetail">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <ownerTop :item="ownerDetail"></ownerTop>
                <div class="owner-content">
                    <mt-navbar class="d1" v-model="selected">
                        <mt-tab-item class="d1-option" id="1">
                            工地
                            <span v-if="ownerDetail.projdCount">{{ownerDetail.projdCount}}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="2">
                            直播
                            <span v-if="ownerDetail.pdCount">{{ownerDetail.pdCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="3">
                            精华
                            <span v-if="ownerDetail.eliteCount">{{ownerDetail.eliteCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="4">
                            账单
                            <span v-if="ownerDetail.billCount">{{ownerDetail.billCount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                        <mt-tab-item class="d1-option" id="5">
                            评价
                            <span v-if="ownerDetail.accesscount">{{ownerDetail.accesscount }}</span>
                            <div class="tab-item-bottom">
                            </div>
                        </mt-tab-item>
                    </mt-navbar>
                    <mt-tab-container v-model="selected">
                        <mt-tab-container-item class="site-content" id="1">
                            <div class="site-infor">
                                <div class="infor-title jusbt">
                                    <div class="infor-title-left">
                                        <div class="title-left"></div>
                                        <div class="title-right">工地信息</div>
                                    </div>
                                    <div class="infor-title-right">
                                        热度排名 {{ownerDetail.hotIndex }}
                                    </div>
                                </div>
                                <table class="site-table">
                                    <tbody>
                                        <tr>
                                            <th style="width: 50%">工地名称：
                                                <span style="color:#3db8a8;">{{ownerDetail.projname }}</span>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th style="width: 50%">开工日期：{{format(ownerDetail.startDate,'yyyy-MM-dd')}}/{{ownerDetail.phase }}</th>
                                        </tr>
                                        <tr>
                                            <th>户型：{{ownerDetail.houseType }}</th>
                                            <th>面积：{{ownerDetail.houseArea }}㎡</th>
                                            <th>风格：{{ownerDetail.decoStyle }}</th>
                                        </tr>
                                        <tr>
                                            <th>城市：{{ownerDetail.city }}</th>
                                            <th>小区：{{ownerDetail.village }}</th>
                                            <th>造价：{{ownerDetail.price }}万</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="site-team">
                                <div class="infor-title">
                                    <div class="title-left"></div>
                                    <div class="title-right">服务团队</div>
                                </div>
                                <div class="stie-cell-list">
                                    <siteCell v-for="(item,index) in ownerDetail.userList" :item="item" :key="index"></siteCell>
                                </div>
                            </div>
                            <div class="shop-team" v-if="ownerDetail.merList&&ownerDetail.merList.length>0">
                                <div class="shop-title-div">
                                    <div class="infor-title">
                                        <div class="title-left"></div>
                                        <div class="title-right">服务商家</div>
                                    </div>
                                    <div v-if="ownerDetail.merList.length>=2" @click="toShopList(ownerDetail.projid)" class="shop-more">查看更多&gt;&gt;</div>
                                </div>
                                <div class="shop-cell-list">
                                    <shopsObj v-for="(item,index) in ownerDetail.merList" :item="item" :key="index"></shopsObj>
                                </div>
                            </div>
                            <div class="site-dyna">
                                <div class="dyna-title-div">
                                    <div class="infor-title">
                                        <div class="title-left"></div>
                                        <div class="title-right">工地直播</div>
                                    </div>
                                </div>
                                <div class="site-screen-div">
                                    <div class="site-screen">
                                        <div v-for="(option,index) in styleList" @click="styleClick(option.name,index)" :key="index" class="site-option" :class="{'select':index==parseInt(styleIndex)+1}">{{option.name}}</div>
                                    </div>
                                    <div class="site-screen-right" @click="styleShowC()">
                                        <img src="./img/shouye_btn_fenlei.png" />
                                    </div>
                                </div>
                                <div class="site-pro-option" v-if="aiteAsc=='0'" @click="siteData()">
                                    按时间倒序浏览
                                    <img class="site-pro-img" src="./img/icon_paixu_xia.png">
                                </div>
                                <div class="site-pro-option" v-else @click="siteData()">
                                    按时间顺序浏览
                                    <img class="site-pro-img" src="./img/icon_paixu_shang.png">
                                </div>
                                <div v-if="JSON.stringify(ownerproj)!= '[]'" class="site-dynaItems-list">
                                    <div v-for="(item,index) in ownerproj" :key="index">
                                        <aidTop :from="'list'" :tab="'site'" v-if="item.datatype=='1'" :extradata="JSON.parse(item.extradata)" :item="item"></aidTop>
                                        <assesses :from="'list'" :tab="'site'" v-else-if="item.datatype=='3'" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                        <dynamic v-else ref="dynamic" :tab="'site'" :index="index" :from="'list'" :dataid="item.id" :type="'1'" :item="item"></dynamic>
                                    </div>
                                </div>
                                <myNone v-else></myNone>
                            </div>
                        </mt-tab-container-item>
                        <mt-tab-container-item class="dyna-content" id="2">
                            <div class="dyna-top">
                                <div class="dyna-screen">
                                    <div class="dyna-screen-button" @click="screen()">
                                        <span>{{datatypeName}}</span>
                                        <img v-if="!screenShow" src="./img/geren_zhibo_btn_shang2.png">
                                        <img v-else src="./img/geren_zhibo_btn_xia1.png">
                                    </div>
                                </div>
                                <div class="dyna-order" v-if="aiteAsc1=='0'" @click="dynaData()">
                                    按时间倒序浏览
                                    <img src="./img/icon_paixu_xia.png">
                                </div>
                                <div class="dyna-order" v-else @click="dynaData()">
                                    按时间顺序浏览
                                    <img src="./img/icon_paixu_shang.png">
                                </div>
                            </div>
                            <div v-if="ownerDynamic&&ownerDynamic.length>0">
                                <div v-for="(item,index) in ownerDynamic " :key="index">
                                    <aidTop :from="'list'" :tab="'dyna'" :index="index" v-if="item.datatype=='1'" :extradata="JSON.parse(item.extradata)" :item="item"></aidTop>
                                    <assesses :from="'list'" :tab="'dyna'" :index="index" v-else-if="item.datatype=='3'" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                    <dynamic v-else ref="dynamic" :tab="'dyna'" :index="index" :from="'list'" :dataid="item.id" :type="'1'" :item="item"></dynamic>
                                </div>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item id="3">
                            <div v-if="ownerElite&&ownerElite.length>0">
                                <div v-for="(item,index) in ownerElite " :key="index">
                                    <aidTop :from="'list'" :tab="'elite'" :index="index" v-if="item.datatype=='1'" :extradata="JSON.parse(item.extradata)" :item="item"></aidTop>
                                    <assesses :from="'list'" v-else-if="item.datatype=='3'" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                    <dynamic v-else ref="dynamic" :tab="'elite'" :index="index" :from="'list'" :dataid="item.id" :type="'1'" :item="item"></dynamic>
                                </div>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item id="4">
                            <bill v-if="ownerBill&&ownerBill.length>0" :ownerid="ownerDetail.ownerid" :ownerBill="ownerBill"></bill>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                        <mt-tab-container-item id="5">
                            <div class="dyna-top">
                                <div class="dyna-screen">
                                    <div class="dyna-screen-button" @click="assessScreenShow=true">
                                        <span>{{assessTypeName}}</span>
                                        <img v-if="!assessScreenShow" src="./img/geren_zhibo_btn_shang2.png">
                                        <img v-else src="./img/geren_zhibo_btn_xia1.png">
                                    </div>
                                </div>
                                <div class="dyna-order" v-if="assASC=='0'" @click="assData()">
                                    按时间倒序浏览
                                    <img src="./img/icon_paixu_xia.png">
                                </div>
                                <div class="dyna-order" v-else @click="assData()">
                                    按时间顺序浏览
                                    <img src="./img/icon_paixu_shang.png">
                                </div>
                            </div>
                            <div v-if="ownerAssess&&ownerAssess.length>0" class="ownerAssess-list">
                                <div v-for="(item,index) in ownerAssess " :key="index">
                                    <assesses :from="'list'" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                                </div>
                            </div>
                            <myNone v-else></myNone>
                        </mt-tab-container-item>
                    </mt-tab-container>
                </div>
            </mt-loadmore>
        </div>
        <mt-actionsheet :actions="styleList" v-model="styleShow" cancelText="取消">
        </mt-actionsheet>
        <mt-actionsheet :actions="DynascreenList" v-model="screenShow" cancelText="取消">
        </mt-actionsheet>
        <mt-actionsheet :actions="assessScreenList" v-model="assessScreenShow" cancelText="取消">
        </mt-actionsheet>
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
    Actionsheet
} from 'mint-ui';
import Vue from 'vue'

import utils from '../../common/utils'
import config from '../../common/config.class'
import ownerTop from '../assembly/ownerTop/ownerTop'
import ownerDetail from '../../common/owner/ownerDetail.class'
import ownerproj from '../../common/owner/ownerDetailProj.class'
import ownerDynamic from '../../common/owner/ownerDynamic.class'
import ownerElite from '../../common/owner/ownerElite.class'
import ownerBill from '../../common/owner/ownerBill.class'
import ownerAssess from '../../common/owner/ownerAssess.class'
import bill from './ownerEcharts'
import './ownerDetail.scss'
import stars from '../assembly/stars/stars.vue'
import aidTop from '../assembly/aidTop/aidTop'
import siteCell from '../assembly/siteCell/siteCell'
import shopsObj from '../assembly/shopsObj/shopsObj'
import dynamic from '../assembly/dynamic/dynamic'
import menuTop from '../assembly/menu/menu-top.vue'
import menuBottom from '../assembly/menu/menu-bottom.vue'
import assesses from '../assembly/assesses/assesses.vue'
import myNone from '../my-none/my-none.vue'
export default {
    data: function() {
        return {
            styleList: [],
            DynascreenList: [],
            assessScreenList: [],
            styleShow: false,
            assessScreenShow: false,
            styleIndex: -1,
            selected: '1',
            ownerDetail: Object,
            topObj: Object,
            ownerproj: [],
            ownerDynamic: [],
            ownerElite: [],
            ownerAssess: [],
            ownerBill: [],
            aiteAsc: '0',
            aiteAsc1: '0',
            assASC: '0',
            targetRoleid: '-1',
            pageIndex: {
                projIndex: 0,
                dynamicIndex: 0,
                eliteIndex: 0,
                assIndex: 0,
            },
            screenShow: false,
            projLastId: '-1',
            dynamicLastId: '-1',
            datatype: '-1',
            datatypeName: '全部',
            assessTypeName: '全部',
            avatarDefault: require('../images/default_head.png'),
        }
    },
    created() {
        let styleName = ['全部', '前期', '设计', '拆改', '水电', '泥工', '木工', '油漆', '完工', '软装', '入住']
        for (let i = 0; i < styleName.length; i++) {
            this.styleList.push({ 'name': styleName[i], 'method': this.styleClick })
        }
        let Dynascreen = ['全部', '求助', '话题']
        for (let i = 0; i < Dynascreen.length; i++) {
            this.DynascreenList.push({ 'name': Dynascreen[i], 'method': this.screenoption })
        }
        let assessScreen = ['全部', '设计师', '工长', '客服', '监理', '商家']
        for (let i = 0; i < assessScreen.length; i++) {
            this.assessScreenList.push({ 'name': assessScreen[i], 'method': this.assessoption })
        }
    },
    activated: function() {
        this.active(-1);
        this.siteDynamic();
    },
    methods: {
        active: function(step) {
            let OD = new ownerDetail(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '-1',
                ownerid: this.$route.query.ownerid,
                dynaCount: '10',
                step: step
            }
            Indicator.open({
                text: '加载中...'
            });
            OD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.ownerDetail = res.body.body
                    this.styleIndex = step
                    let shareUrl = ''
                    console.log(res);
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/ownerDetail?ownerid=' + this.$route.query.ownerid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/ownerDetail?ownerid=' + this.$route.query.ownerid
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
        format: function(time, str) {
            return utils.format(time, str);
        },
        styleClick: function(actions, index) {
            this.styleIndex = (index - 1)
            this.ownerproj = []
            this.pageIndex.projIndex = 0
            this.projLastId = '-1'
            this.siteDynamic()
        },
        //筛选阶段显示
        styleShowC: function() {
            this.styleShow = true;
        },
        screen: function() {
            this.screenShow = !this.screenShow
        },
        screenoption: function(actions, index) {
            let datatype = index
            if (index == 0) {
                datatype = '-1'
            } else if (index == 2) {
                datatype = '3'
            }
            this.datatypeName = actions.name
            this.screenShow = false
            this.datatype = datatype
            this.pageIndex.dynamicIndex = 0
            this.dynamicLastId = '-1'
            this.dynaDynamic()
        },
        assessoption: function(actions, index) {
            if (index == 0) {
                this.targetRoleid = '-1'
            } else if (index == 1) {
                this.targetRoleid = '1'
            } else if (index == 2) {
                this.targetRoleid = '2'
            } else if (index == 3) {
                this.targetRoleid = '5'
            } else if (index == 4) {
                this.targetRoleid = '6'
            } else if (index == 5) {
                this.targetRoleid = '7'
            }
            this.pageIndex.assIndex = 0
            this.ownerAssess = []
            this.ownerAss();
        },
        //评价数据加载
        ownerAss: function() {
            let OA = new ownerAssess(this)
            this.pageIndex.assIndex = this.pageIndex.assIndex + 1
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '',
                ownerid: this.$route.query.ownerid,
                pageIndex: this.pageIndex.assIndex,
                pageSize: '10',
                targetRoleid: this.targetRoleid,
                asc: this.assASC
            }
            Indicator.open({
                text: '加载中...'
            });
            OA.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    console.log(res);
                    let start = res.body.body.dynaItems.length;
                    if (start > 0) {
                        if (this.pageIndex.assIndex > 1) {
                            for (let i = 0; i < start; i++) {
                                this.ownerAssess.push(res.body.body.dynaItems[i])
                            }
                        } else {
                            this.ownerAssess = res.body.body.dynaItems
                        }
                    }
                    console.log(this.ownerAssess)
                    if (this.pageIndex.assIndex > 1) {
                        setTimeout(() => {
                            this.$refs.loadmore.onBottomLoaded();
                        }, 500)
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //账单数据加载
        ownerEq: function() {
            let OB = new ownerBill(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '',
                ownerid: this.$route.query.ownerid,
            }
            Indicator.open({
                text: '加载中...'
            });
            OB.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.ownerBill = res.body.body.billItems
                    console.log(this.ownerBill)
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //精华数据加载
        eliteDynamic: function() {
            let OE = new ownerElite(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.eliteIndex = this.pageIndex.eliteIndex + 1
            let reqParam = {
                uid: loginUser.userId || '',
                ownerid: this.$route.query.ownerid,
                pageIndex: this.pageIndex.eliteIndex,
                pageSize: '10'
            }
            Indicator.open({
                text: '加载中...'
            });
            OE.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    let start = res.body.body.dynaItems.length;
                    if (start > 0) {
                        if (this.pageIndex.eliteIndex > 1) {
                            for (let i = 0; i < start; i++) {
                                this.ownerElite.push(res.body.body.dynaItems[i])
                            }

                        } else {
                            this.ownerElite = res.body.body.dynaItems
                        }
                    }
                } else {
                    Toast(res.body.respMsg)
                }
                if (this.pageIndex.eliteIndex > 1) {
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded();
                    }, 500)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //直播数据加载
        dynaDynamic: function() {

            let OD = new ownerDynamic(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            Indicator.open({
                text: '加载中...'
            });
            this.pageIndex.dynamicIndex = this.pageIndex.dynamicIndex + 1
            let reqParam = {
                uid: loginUser.userId || '',
                userid: this.$route.query.ownerid,
                asc: this.aiteAsc1,
                lastId: this.dynamicLastId,
                pageIndex: this.pageIndex.dynamicIndex,
                pageSize: '10',
                datatype: this.datatype,
            }
            OD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    console.log(res);
                    let start = res.body.body.dynaItems.length;
                    if (start > 0) {
                        if (this.pageIndex.dynamicIndex > 1) {
                            for (let i = 0; i < start; i++) {
                                this.ownerDynamic.push(res.body.body.dynaItems[i])
                            }
                        } else {
                            this.ownerDynamic = res.body.body.dynaItems
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
        //工地直播数据加载
        siteDynamic: function() {
            let OP = new ownerproj(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex.projIndex = this.pageIndex.projIndex + 1
            let reqParam = {
                uid: loginUser.userId || '',
                ownerid: this.$route.query.ownerid,
                step: this.styleIndex,
                asc: this.aiteAsc,
                lastId: this.projLastId,
                pageIndex: this.pageIndex.projIndex,
                pageSize: '10'
            }
            Indicator.open({
                text: '加载中...'
            });
            OP.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    let start = res.body.body.dynaItems.length;
                    if (this.pageIndex.projIndex > 1) {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.ownerproj.push(res.body.body.dynaItems[i])
                            }
                        }
                    } else {
                        this.ownerproj = res.body.body.dynaItems
                    }
                    if (start > 0) {
                        this.projLastId = res.body.body.dynaItems[res.body.body.dynaItems.length - 1].id
                    }
                    console.log(this.ownerproj)
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
        //跳转服务商家列表
        toShopList: function(id) {
            this.$router.push({
                name: 'shopsList',
                query: {
                    projid: id
                }
            })
        },

        //加载更多
        infinite: function() {

            if (this.selected == '1') {
                this.siteDynamic();
            } else if (this.selected == '2') {
                this.dynaDynamic();
            } else if (this.selected == '3') {
                this.eliteDynamic();
            } else if (this.selected == '4') {
                this.$refs.loadmore.onBottomLoaded();
            } else if (this.selected == '5') {
                this.ownerAss();
            }
        },
        //刷新页面
        loadTop: function() {
            this.active('-1');
            if (this.selected == '1') {
                this.projLastId = '-1'
                this.pageIndex.projIndex = 0
                this.siteDynamic();
            } else if (this.selected == '2') {
                this.datatypeName = '全部'
                this.datatype = '-1'
                this.screenShow = false
                this.dynamicLastId = '-1'
                this.pageIndex.dynamicIndex = 0
                this.dynaDynamic();
            } else if (this.selected == '3') {
                this.pageIndex.eliteIndex = 0
                this.eliteDynamic();
            } else if (this.selected == '5') {
                this.pageIndex.assIndex = 0
                this.assessTypeName = '全部'
                this.targetRoleid = '-1'
                this.aiteAsc = '0'
                this.ownerAss();
            }
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
        //工地TAB时间顺序切换
        siteData: function() {
            if (this.aiteAsc == '0') {
                this.aiteAsc = '1'
            } else {
                this.aiteAsc = '0'
            }
            this.pageIndex.projIndex = 0
            this.projLastId = '-1'
            this.siteDynamic()
        },
        //直播TAB时间顺序切换
        dynaData: function() {
            if (this.aiteAsc1 == '0') {
                this.aiteAsc1 = '1'
            } else {
                this.aiteAsc1 = '0'
            }
            this.pageIndex.dynamicIndex = 0
            this.dynamicLastId = '-1'
            this.dynaDynamic()
        },
        //直播TAB时间顺序切换
        assData: function() {
            if (this.assASC == '0') {
                this.assASC = '1'
            } else {
                this.assASC = '0'
            }
            this.pageIndex.assIndex = 0
            this.ownerAss()
        },
    },
    watch: {
        $route(to, from) {
            if (to.name == 'ownerDetail' && from.name == 'ownerDetail') {
                this.projLastId = '-1'
                this.pageIndex.projIndex = 0
                this.datatypeName = '全部'
                this.datatype = '-1'
                this.screenShow = false
                this.dynamicLastId = '-1'
                this.pageIndex.dynamicIndex = 0
                this.pageIndex.eliteIndex = 0
                this.pageIndex.assIndex = 0
                this.assessTypeName = '全部'
                this.targetRoleid = '-1'
                this.aiteAsc = '0'
                this.selected = '1'
                this.ownerproj = []
                this.ownerDynamic = []
                this.ownerElite = []
                this.ownerAssess = []
                this.ownerBill = []
                this.active('-1');
                this.siteDynamic();
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },
        selected: function(val) {
            if (val == '2') {
                if (this.ownerDynamic.length <= 0) {
                    this.dynaDynamic();
                }
            } else if (val == '3') {
                if (this.ownerElite.length <= 0) {
                    this.eliteDynamic();
                }
            } else if (val == '4') {
                if (this.ownerBill == '') {
                    this.ownerEq();
                }
            } else if (val == '5') {
                if (this.ownerAssess.length <= 0) {
                    this.ownerAss();
                }
            }
            // this.done1//每次切换tab的时候初始化加载更多方法
        },

    },
    components: {
        Navbar,
        TabItem,
        TabContainer,
        TabContainerItem,
        bill,
        stars,
        siteCell,
        shopsObj,
        dynamic,
        menuTop,
        menuBottom,
        myNone,
        ownerTop,
        assesses,
        aidTop
    }
}
</script>
