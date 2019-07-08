<template>
    <div class="assesses">
        <div class="assesses-infor-div">
            <div class="top-user-infor">
                <img v-if="shopAss.avatar" @click="toRuleDetail(shopAss.uid,shopAss.roleid,shopAss.merid )" :src="shopAss.avatar" />
                <img v-else @click="toRuleDetail(shopAss.uid,shopAss.roleid,shopAss.merid )" src="./img/default.png" />
                <div>
                    <p @click="toRuleDetail(shopAss.uid,shopAss.roleid,shopAss.merid )">{{shopAss.username}}</p>
                    <p>{{shopAss.assessDate}}发起了评价</p>
                </div>
            </div>
            <div class="evaluate-content">
                <!--<div v-if="shopAss.assessType=='0'" class="evaluate-type daodian">到店评价 </div>
                                                                                            <div v-else-if="shopAss.assessType=='1'" class="evaluate-type ff8736">购买评价 </div>-->
                <span v-html="shopAss.assessTxt"></span>
            </div>
            <div v-if="shopAss.images" class="avatar-list">
                <div v-for="(images,index) in shopAss.images" class="assesses-avatar" :key="index" :style="'background-image: url('+images.listImg+')' " @click="$preview($event, shopAss.images, index,'detailImg')">
                </div>
                <div style="clear:both;"></div>
            </div>
        </div>
        <div v-if="shopAss.addAssess" class="chase-ratings">
            <p class="chase-ratings-title">用户追评</p>
            <div class="evaluate-content" v-html="shopAss.addAssess.assessTxt"></div>
            <div v-if="shopAss.addAssess.images" class="avatar-list">
                <div v-for="(images2,index) in shopAss.addAssess.images" :key="index" class="assesses-avatar" :style="'background-image: url('+images2.listImg+')'" @click="$preview($event, shopAss.addAssess.images, index,'detailImg')">
                </div>
                <div style="clear:both;"></div>
            </div>
        </div>
        <div v-if="shopAss.assessType=='0'" class="ass-evaCount">
            <span>服务态度{{parseFloat(shopAss.scoreProf ).toFixed(1)}}</span>
        </div>
        <div v-else-if="shopAss.assessType=='1'" class="ass-evaluate">
            <div>服务态度{{parseFloat(shopAss.scoreManner ).toFixed(1)}}</div>
            <div>商品质量{{parseFloat(shopAss.scoreProf ).toFixed(1)}}</div>
            <div>描述相同{{parseFloat(shopAss.scoreActive ).toFixed(1)}}</div>
        </div>
        <div class="shopAss-infor">
            <img :src="shopAss.merItem.merlogo" />
            <div class="shopAss-infor-a">
                <div style="width:60%;">
                    <p class="shopAss-mer-title">{{shopAss.merItem.mername }}</p>
                    <p class="shopAss-mer-txt">主营：{{shopAss.merItem.goods}}</p>
                    <div class="shopASS-ga">
                        <div class="grade">金牌商家</div>
                        <div class="assure">保</div>
                    </div>
                </div>
                <img class="shopAss-toShop" @click="toShop(shopAss.merItem.merid)" src="./img/zhibo_btn_jindian.png" />
            </div>
        </div>
        <div v-if="shopAss.assessType=='1'&&!shopAss.addAssess&&assShow" class="shopAss-operation">
            <div class="shopAss-operation-data">

            </div>
            <div class="shopAss-operation-div">
                <div @click="toAddAssesses(shopAss.dataId,shopAss.merItem.merid,shopAss.id,shopAss.dataType)">
                    追加评价<img src="./img/aic_btn_right3.png" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import './shopAss.scss'
import Vue from 'vue'
import Vuex from "vuex"
import utils from '../../common/utils'
import stars from '../stars/stars.vue'
import wcView from 'wc-view';
import config from '../../common/config.class'
import 'wc-view/style.css';
Vue.use(Vuex)
Vue.use(wcView);
export default {
    name: 'shopAss',
    props: ['shopAss', 'assShow'],
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
        }
    },
    methods: {
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid) {
            return utils.toRuleDetail(this, uid, roleid, merid)
        },
        getRole: function(roleId) {
            return utils.getRole(roleId);
        },
        toShop: function(merid) {
            window.location.href = config.MALL() + "/#/shop-detail/" + merid + "";
        },
        toAddAssesses: function(id, merid, todoId, dataType) {
            this.$router.push({
                name: 'addAssesses',
                query: {
                    dataId: id,
                    merid: merid,
                    parentid: todoId,
                    dataType: dataType,
                    uid: utils.getUrlParam('uid') || '',//loginUser.uid,
                    serialNo: utils.getUrlParam('serialNo') || '',//loginUser.serialNo,
                    authCode: utils.getUrlParam('authCode') || '',//loginUser.authCode,
                }
            })
        }
    },
    components: {
        stars,
    },

}
</script>