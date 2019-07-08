<template>
    <div class="site-cell">
        <p class="site-cell-title" v-if="item.cellId&&item.userid ">由
            <span @click="toCellDetail(item.cellId,item.cellType)">{{item.cellName}}</span>提供{{getcellType(item.cellType)}}服务
        </p>
        <p class="site-cell-title" v-else-if="item.userid">
            未签约{{getcellType(item.roleid)}}工作室
        </p>
        <p class="site-cell-title" v-else-if="item.roleid=='5'">
            {{getcellType(item.roleid)}}服务人员暂未到岗
        </p>
        <p class="site-cell-title" v-else>
            未签约{{getcellType(item.roleid)}}工作室
        </p>
        <div class="site-cell-userInfo">
            <div class="site-role-infor">
                <img class="site-role-avatar" :src="item.useravatar||avatarDefault" @click="toRuleDetail(item.userid,item.roleid,'',item.pubStatus)">
                <div class="site-role-div" v-if="item.userid" @click="toRuleDetail(item.userid,item.roleid,'',item.pubStatus)">
                    <p class="site-role-name">{{item.username}}/
                        <span>{{item.userRank}}</span>
                    </p>
                    <p class="site-role-iden"> 案例{{item.casecount }}个</p>
                    <div class="site-assess">
                        <stars :starsObj="{score:item.score  ,maxScore:5}"></stars>
                        <span>口碑 {{item.score.toFixed(1) }}</span>
                    </div>
                </div>
                <div class="site-role-div" v-else>
                    <p class="site-role-name">{{item.username}}/
                        <span>{{getRole(item.roleid)}}</span>
                    </p>
                </div>
            </div>
            <div class="pro-follow" v-if="item.userid" @click="follow(item.userid)">
                <img v-if="item.followStatus=='0'" src="../../images/zhibo_btn_guanzhu.png" />
                <img v-else src="../../images/btn_yiguanzhu.png" />
                <p v-if="item.followStatus=='0'">关注</p>
                <p v-else class="c8">已关注</p>
            </div>
        </div>
    </div>
</template>
<script>
import './siteCell.scss'
import stars from '../stars/stars.vue'
import utils from '../../../common/utils'
import {
    Toast,
    Indicator
} from 'mint-ui';
import userFollow from '../../../common/userFollow.class'
export default {
    props: ['item'],
    data() {
        return {
            avatarDefault: require('../../images/default_head.png')
        }
    },
    methods: {
        getcellType: function(cellType) {
            return utils.getcellType(cellType)
        },
        getRole: function(roleId) {
            return utils.getRole(roleId);
        },
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid, pubStatus) {
            if (pubStatus == '-2') {
                Toast('该' + utils.getRole(roleid) + '正在确认中，请稍后查看!')
                return;
            }
            return utils.toRuleDetail(this, uid, roleid, merid)
        },
        //跳转工作室详情
        toCellDetail: function(id, type) {
            this.$router.push({
                name: 'cellDetail',
                query: {
                    cellId: id,
                    cellType: type
                }
            })
        },
        follow: function(targetUid) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let UF = new userFollow(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                targetUid: targetUid
            }
            Indicator.open({
                text: '提交中...'
            });
            let followStatus = ''
            if (this.item.followStatus == '0' || this.item.followStatus == 0) {
                followStatus = '1'
            } else {
                followStatus = '0'
            }
            UF.request(reqParamcom, followStatus).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.item.followStatus == 1) {
                        utils.vToast(res.body.respMsg, '取消关注成功')
                        this.item.followStatus = '0'
                    } else {
                        utils.vToast(res.body.respMsg, '关注成功')
                        this.item.followStatus = '1'
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        }
    },
    components: {
        stars,
    }
}
</script>

