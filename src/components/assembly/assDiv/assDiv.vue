<template>
    <div class="ruleAss">
        <div class="top-user-infor">
            <img v-if="ruleAss.avatar" :src="ruleAss.avatar" />
            <img v-else :src="defaultAvatar" />
            <div>
                <p>{{ruleAss.username}}</p>
                <p>{{ruleAss.assessDate}}发起了评价</p>
            </div>
        </div>
        <div class="ass-div">
            <div class="title">
                <div></div>
                <p>评价对象</p>
            </div>
            <div v-if="ruleAss.targetUser" class="ruleAss-rule-infor" @click="toRule(ruleAss.targetUser.uid,ruleAss.targetUser.roleId)">
                <img :src="ruleAss.targetUser.avatar">
                <div>
                    <p>{{ruleAss.targetUser.username}}/
                        <span>{{ruleAss.targetUser.userRank}}</span>
                    </p>
                    <p>{{ruleAss.targetUser.slogan}}</p>
                </div>
            </div>
            <div class="shopAss-infor" v-else-if="ruleAss.merItem">
                <img :src="ruleAss.merItem.merlogo" />
                <div class="shopAss-infor-a">
                    <div style="width:60%;">
                        <p class="shopAss-mer-title">{{ruleAss.merItem.mername }}</p>
                        <p class="shopAss-mer-txt">主营：{{ruleAss.merItem.goods}}</p>
                        <div class="shopASS-ga">
                            <div class="grade">金牌商家</div>
                            <div class="assure">保</div>
                        </div>
                    </div>
                    <img class="shopAss-toShop" @click="toShop(ruleAss.merItem.merid)" src="./img/zhibo_btn_jindian.png" />
                </div>
            </div>
        </div>
        <div class="ass-div">
            <div class="title">
                <div></div>
                <p>评价得分</p>
                <button class="phase" v-if="ruleAss.phase">
                    {{ruleAss.phase }}阶段
                </button>
            </div>
            <div class="ass-infor" v-if="ruleAss.assessType =='2'">
                <div class="ass-c">
                    <p>专业水平</p>
                    <stars :starsObj="{score:ruleAss.scoreProf,maxScore:5}"></stars>
                    <span>{{parseFloat(ruleAss.scoreProf).toFixed(1)}}</span>
                </div>
                <div class="ass-c">
                    <p>服务态度</p>
                    <stars :starsObj="{score:ruleAss.scoreManner,maxScore:5}"></stars>
                    <span>{{parseFloat(ruleAss.scoreManner).toFixed(1)}}</span>
                </div>
                <div class="ass-c">
                    <p>直播互动</p>
                    <stars :starsObj="{score:ruleAss.scoreActive,maxScore:5}"></stars>
                    <span>{{parseFloat(ruleAss.scoreActive).toFixed(1)}}</span>
                </div>
            </div>
            <div class="ass-infor" v-else>
                <div class="ass-c">
                    <p>服务态度</p>
                    <stars :starsObj="{score:ruleAss.scoreManner ,maxScore:5}"></stars>
                    <span>{{parseFloat(ruleAss.scoreManner ).toFixed(1)}}</span>
                </div>
                <div class="ass-c">
                    <p>商品质量</p>
                    <stars :starsObj="{score:ruleAss.scoreProf,maxScore:5}"></stars>
                    <span>{{parseFloat(ruleAss.scoreProf).toFixed(1)}}</span>
                </div>
                <div class="ass-c">
                    <p>描述相同</p>
                    <stars :starsObj="{score:ruleAss.scoreActive,maxScore:5}"></stars>
                    <span>{{parseFloat(ruleAss.scoreActive).toFixed(1)}}</span>
                </div>
            </div>
        </div>
        <div class="ass-div">
            <div class="title">
                <div></div>
                <p>评价详情</p>
            </div>
            <p class="ruleAss-txt" v-html="ruleAss.assessTxt"></p>
            <div v-if="ruleAss.images&&ruleAss.images.length>0" :class="[ruleAss.images.length==1?'avatar-list length1':'avatar-list',ruleAss.images.length==4?'length4':'',]">
                <div v-for="(images,index) in ruleAss.images" class="assesses-avatar" :key="index" :style="'background-image: url('+images.listImg+')' " @click="$preview($event, ruleAss.images, index,'detailImg')">
                </div>
            </div>
            <div v-if="ruleAss.addAssess" class="chase-ratings">
                <p class="chase-ratings-title">用户追评</p>
                <p class="chase-date">{{ruleAss.assessDate}}发起了评价</p>
                <div class="evaluate-content" v-html="ruleAss.addAssess.assessTxt"></div>
                <div v-if="ruleAss.addAssess.images&&ruleAss.addAssess.images.length>0" :class="[ruleAss.addAssess.images.length==1?'avatar-list length1':'avatar-list',ruleAss.addAssess.images.length==4?'length4':'',]">
                    <div v-for="(images2,index) in ruleAss.addAssess.images" :key="index" class="assesses-avatar" :style="'background-image: url('+images2.listImg+')'" @click="$preview($event, ruleAss.addAssess.images, index,'detailImg')">
                    </div>
                </div>
            </div>
        </div>
        <div class="ruleAss-operation">
            <div class="ruleAss-operation-data">
                <div>
                    <img class="zan" src="./img/btn_pinglunqu_zan.png" /> 1232
                </div>
                <div>
                    <img class="com" src="./img/btn_pinglun.png" /> 1232
                </div>
            </div>
            <div class="ruleAss-operation-div">
                <div class="reappraisal" v-if="ruleAss.assessType=='2'" @click="reappraisal(ruleAss.todoId,ruleAss.targetUser.roleId)">
                    重新评价<img src="../shopAss/img/aic_btn_right3.png" />
                </div>
                <div v-else-if="!ruleAss.addAssess" @click="toAddAssesses(ruleAss.dataId,ruleAss.merItem.merid,ruleAss.id,ruleAss.dataType)">
                    追加评价<img src="./img/btn_right.png" />
                </div>
                <div>
                    查看详情<img src="./img/btn_right.png" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import './ruleAss.scss'
import '../shopAss/shopAss.scss'
import utils from '../../common/utils'
import stars from '../stars/stars'
import wcView from 'wc-view';
import Vue from 'vue'
import Vuex from "vuex"
import 'wc-view/style.css';
Vue.use(Vuex)
Vue.use(wcView);
export default {
    name: 'ruleAss',
    props: ['ruleAss'],
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            defaultAvatar: require('./img/default.png')
        }
    },
    methods: {
        reappraisal: function(todoId, roleId) {
            window.location.href = 'huihome://page/reAccess?{"todoId":' + todoId + ',"roleId":' + roleId + '}';
        },
        getRole: function(roleId) {
            return utils.getRole(roleId);
        },
        toRule: function(uid, roleid) {
            window.location.href = 'huihome://page/user?{"uid":' + uid + ',"roleid":' + roleid + '}';
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
        },
        toShop: function(merid) {
            window.location.href = config.MALL() + "/#/shop-detail/" + merid + "";
        },
    },
    components: {
        stars
    }
}
</script>