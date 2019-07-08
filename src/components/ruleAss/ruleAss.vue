<template>
    <div class="ruleAss">
        <div class="top-user-infor">
            <img v-if="ruleAss.avatar" @click="toRuleDetail(ruleAss.uid,ruleAss.roleid,ruleAss.merid )" :src="ruleAss.avatar" />
            <img v-else @click="toRuleDetail(ruleAss.uid,ruleAss.roleid,ruleAss.merid )" src="./img/default.png" />
            <div>
                <p @click="toRuleDetail(ruleAss.uid,ruleAss.roleid,ruleAss.merid )">{{ruleAss.username}}</p>
                <p>{{ruleAss.assessDate}}发起了评价</p>
            </div>
        </div>
        <p class="ruleAss-txt" v-html="ruleAss.assessTxt"></p>
        <div class="ruleAss-ass-infor">
            <!--<div class="ruleAss-reappraisal" @click="reappraisal(ruleAss.todoId)">
                                                            重新评价
                                                        </div>-->
            <div class="ruleAss-ass">
                <div>
                    专业 {{parseFloat(ruleAss.scoreProf).toFixed(1)}}
                </div>
                <div>
                    服务 {{parseFloat(ruleAss.scoreManner).toFixed(1)}}
                </div>
                <div>
                    互动 {{parseFloat(ruleAss.scoreActive).toFixed(1)}}
                </div>
                <div class="phase">
                    {{ruleAss.phase}}
                </div>
            </div>
        </div>
        <div v-if="targetShow!=false" class="ruleAss-rule-infor" @click="toRule(ruleAss.targetUser.uid,ruleAss.targetUser.roleId)">
            <img :src="ruleAss.targetUser.avatar">
            <div>
                <p>{{ruleAss.targetUser.username}}
                    <span>/{{ruleAss.targetUser.roleId}}</span>
                </p>
                <p>{{ruleAss.targetUser.slogan}}</p>
            </div>
        </div>
        <div v-if="assShow" class="ruleAss-operation">
            <div class="ruleAss-operation-data">
                <!--<div>
                        <img class="zan" src="./img/btn_pinglunqu_zan.png" /> 1232
                    </div>
                    <div>
                        <img class="com" src="./img/btn_pinglun.png" /> 1232
                    </div>-->
            </div>
            <div class="ruleAss-operation-div">
                <div @click="reappraisal(ruleAss.todoId)">
                    重新评价<img src="./img/btn_right.png" />
                </div>
                <!--<div>
                            查看详情<img src="./img/btn_right.png" />
                        </div>-->
            </div>
        </div>
    </div>
</template>
<script>
import './ruleAss.scss'
import utils from '../../common/utils'
export default {
    name: 'ruleAss',
    props: ['ruleAss', 'assShow', 'targetShow'],
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
        reappraisal: function(todoId) {
            window.location.href = 'huihome://page/reAccess?{"todoId":' + todoId + '}';
        },
        getRole: function(roleId) {
            return utils.getRole(roleId);
        },
        toRule: function(uid, roleid) {
            window.location.href = 'huihome://page/user?{"uid":' + uid + ',"roleid":' + roleid + '}';
        }
    },

}
</script>