<template>
    <div class="video-content" v-if="item.dynaImages&&item.dynaImages.length>0&&item.dynaImages[0].mediaType=='1'">
        <div @click="videoTimeShoe=false" :index="index" :id="'J_prismPlayer'+tab+index" class="prism-player">
            <p v-show="videoTimeShoe" class="video-time">{{videoTime(item.dynaImages[0].duration)}}</p>
        </div>
        <div class="site-pro-top">
            <div class="pro-user-info">
                <img class="pro-avatar-img" @click="toRuleDetail(item.uid,item.roleid,item.merid)" :src="item.avatar||avatarDefault">
                <img v-if="item.proveStatus=='0'" class="huihome-v" src="../../images/zhibo_icon_vip.png">
                <div class="dyna-userInfo">
                    <p>
                        <span class="pro-user-name" @click="toRuleDetail(item.uid,item.roleid,item.merid)">{{item.username }}</span>
                        <span class="pro-user-role">/{{item.userRank }}</span>
                    </p>
                    <p class="pro-user-date">{{getDateDiff(item.occurTime )}}</p>
                </div>
            </div>
            <div class="pro-follow aid-follow" v-if="type=='6'" @click="aidFollow(item.dataid)">
                <img v-if="item.followStatus=='1'||item.followStatus==1" src="../aidTop/img/zhibo_btn_guanzhuqiuzhu.png" />
                <img v-else src="../aidTop/img/zhibo_btn_yiguanzhuqiuzhu.png" />
            </div>
            <div class="pro-follow" v-else-if="type=='1'" @click="follow(item.uid)">
                <img v-if="item.followStatus=='1'||item.followStatus==1" src="../../images/zhibo_btn_guanzhu.png" />
                <img v-else src="../../images/btn_yiguanzhu.png" />
                <p v-if="item.followStatus=='1'||item.followStatus==1">关注</p>
                <p v-else class="c8">已关注</p>
            </div>
        </div>
    </div>
</template>
<script>
import './detailVideo.scss'
import utils from '../../../common/utils'
import userFollow from '../../../common/userFollow.class'
export default {
    props: ['item', 'index', 'type', 'accept', 'tab'],
    data() {
        return {
            avatarDefault: require('../../images/default_head.png'),
            userId: '',
            videoTimeShoe: true,
            player: Object,
        }
    },
    methods: {
        videoTime: function(time) {
            return parseInt(parseInt(time) / 60) + ':' + parseInt(time) % 60
        },
        getDateDiff: function(dateTimeStamp) {
            return utils.getDateDiff(dateTimeStamp);
        },
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid) {
            return utils.toRuleDetail(this, uid, roleid, merid)
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
                text: '提交中...',
            });
            UF.request(reqParamcom, this.item.followStatus).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.item.followStatus == 0) {
                        utils.vToast(res.body.respMsg, '取消关注成功')
                        this.item.followStatus = '1'
                        this.item.followedCount = parseInt(this.item.followedCount) - 1
                    } else {
                        utils.vToast(res.body.respMsg, '关注成功')
                        this.item.followStatus = '0'
                        this.item.followedCount = parseInt(this.item.followedCount) + 1
                    }
                } else {
                    Indicator.close();
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
    }
}
</script>
