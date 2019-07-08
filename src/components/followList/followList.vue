<template>
    <div class="follow-list">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <div class="follow-div" v-for="(item,index) in allfollowList" :key="index">
                    <div class="follow-infor" @click="toRuleDetail(item.uid,item.targetuserrole,item.uid)">
                        <img class="follow-avatar" :src="item.avatar ||avatarDefault" />
                        <img v-if="item.proveStatus=='0'" class="huihome-v" src="../images/zhibo_icon_vip.png">
                        <div class="follow-data">
                            <p>{{item.username }}
                                <span>/{{item.userRank}}</span>
                            </p>
                            <p v-if="item.targetuserrole=='0'">
                                <span>粉丝数{{item.fansCount }}</span>
                                <span>直播数{{item.pdCount}}</span>
                                <span>精华数{{item.eliteCount }}</span>
                            </p>
                            <p v-else>
                                <span>粉丝数{{item.fansCount }}</span>
                                <span>成功案例{{item.caseCount }}</span>
                                <span>口碑值{{item.totalScore }}</span>
                            </p>
                        </div>
                    </div>
                    <div class="user-follow" @click="follow(item.uid,item.followStatus,index)">
                        <img v-if="item.followStatus=='1'||item.followStatus==1" src="../images/zhibo_btn_guanzhu.png" />
                        <img v-else src="../images/btn_yiguanzhu.png" />
                        <p v-if="item.followStatus=='1'||item.followStatus==1">关注</p>
                        <p v-else class="c8">已关注</p>
                    </div>
                </div>
            </mt-loadmore>
        </div>
    </div>
</template>
<script>
import {
    Toast,
    Indicator,
} from 'mint-ui';
import utils from '../../common/utils'
import config from '../../common/config.class'
import './followList.scss'
import allfollowList from '../../common/user/userAllfollowList.class'
import userFollow from '../../common/userFollow.class'
import menuTop from '../assembly/menu/menu-top'
export default {
    data: function() {
        return {
            allfollowList: [],
            pageIndex: 0,
            avatarDefault: require('../images/default_head.png'),
        }
    },
    activated: function() {
        this.active();
    },
    methods: {
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid) {
            return utils.toRuleDetail(this, uid, roleid, merid)
        },
        active: function() {
            let AF = new allfollowList(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex = this.pageIndex + 1
            let reqParam = {
                uid: loginUser.userId || '9000009',
                userid: this.$route.query.userid,
                type: this.$route.query.type,
                pageSize: '10',
                pageIndex: this.pageIndex
            }
            Indicator.open({
                text: '加载中...'
            });
            AF.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    let start = res.body.body.users.length;
                    if (this.pageIndex == 1) {
                        this.allfollowList = res.body.body.users
                    } else {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.allfollowList.push(res.body.body.users[i])
                            }
                        }
                    }
                    // console.log(res);
                    // let shareUrl = ''
                    // if (!utils.isLocalEnv()) {
                    //     shareUrl = config.SERVERADD() + '/huihomeH5/#/followList?userid=' + this.$route.query.userid + '&type=' + this.$route.query.type + '&shareUid=' + utils.getUrlParam('shareUid')
                    // } else {
                    //     shareUrl = config.SERVERADD() + '/huihomeH5/#/followList?userid=' + this.$route.query.userid + '&type=' + this.$route.query.type
                    // }
                    // utils.publicShare(this, res.body.body, shareUrl)
                } else {
                    Toast(res.body.respMsg)
                }
                if (this.pageIndex > 1) {
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded();
                    }, 500)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //刷新
        loadTop: function() {
            this.pageIndex = 0
            this.active()
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
        //加载更多
        infinite: function() {
            this.active();
        },
        follow: function(targetUid, followStatus, index) {
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
                text: '提交中...',
            });
            UF.request(reqParamcom, followStatus).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (followStatus == 0) {
                        utils.vToast(res.body.respMsg, '取消关注成功')
                        this.allfollowList[index].followStatus = '1'
                    } else {
                        utils.vToast(res.body.respMsg, '关注成功')
                        this.allfollowList[index].followStatus = '0'
                    }
                } else {
                    Indicator.close();
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        }
    },
    components: {
        menuTop,
    },
    watch: {
        $route(to, from) {
            if (to.name == 'followList') {
                this.pageIndex = 0
            }
        },
    }
}
</script>
