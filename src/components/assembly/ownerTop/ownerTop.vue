<template>
    <div class="ownerTop" :style="'background-image: url('+banner(item.bannerImg)+')' ">
        <div class="rule-infor">
            <div class="owner-infor">
                <div class="owner-left">
                    <img class="owner-avatar" :src="item.owneravatar||avatarDefault" />
                    <div class="user-name">
                        <p>{{name(item.ownerName)}}/
                            <span>{{item.userRank}}</span>
                        </p>
                        <img v-if="item.proveStatus=='0'" src="./img/daV.png">
                    </div>
                </div>
                <div class="owner-data-infor" :class="{'owner-data-my':uid!=item.ownerid}">
                    <div class="owner-data-div" v-if="uid==item.ownerid">
                        <p>{{item.huimiCount}}</p>
                        <p>绘米</p>
                    </div>
                    <div v-if="uid==item.ownerid" class="interval"></div>
                    <div class="owner-data-div" @click="tofollow(item.ownerid,'1')">
                        <p>{{item.followCount}}</p>
                        <p>关注</p>
                    </div>
                    <div class="interval"></div>
                    <div class="owner-data-div" @click="tofollow(item.ownerid,'0')">
                        <p>{{item.followedCount}}</p>
                        <p>被关注</p>
                    </div>
                </div>
            </div>
            <div v-if="uid!=item.ownerid&&item.followStatus=='0'" class="ownerTop-follow" @click="follow(item.ownerid)">已关注</div>
            <div v-else-if="uid!=item.ownerid&&item.followStatus!='0'" class="ownerTop-follow" @click="follow(item.ownerid)">+ 关注</div>
        </div>
    </div>
</template>
<script>
import './ownerTop.scss'
import {
    Toast,
    Indicator
} from 'mint-ui';
import utils from '../../../common/utils'
import userFollow from '../../../common/userFollow.class'
export default {
    props: ['item'],
    data: function() {
        return {
            bannerDefault: require('../../images/default_banner.png'),
            avatarDefault: require('../../images/default_head.png'),
            uid: '-1'
        }
    },
    created() {
        this.uid = utils.getLoginData('loginUserAuthToken').userId
    },
    methods: {
        banner: function(url) {
            if (url == '' || url == null || url == 'null') {
                return this.bannerDefault
            } else {
                return url
            }
        },
        name: function(name) {
            if (name) {
                if (name.length > 4) {
                    return name.substring(0, 4) + '...'
                } else {
                    return name
                }
            }
        },
        //跳转关注以及被关注列表
        tofollow: function(userid, type) {
            this.$router.push({
                name: 'followList',
                query: {
                    userid: userid,
                    type: type
                }
            })
        },
        //关注
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
        }
    }
}
</script>
