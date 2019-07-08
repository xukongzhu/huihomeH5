<template>
    <div class="aid">
        <div class="aid-top">
            <div class="df">
                <img class="aid-avatar" @click="toRuleDetail(aid.uid,aid.roleid,aid.merid )" :src="aid.avatar||avatarDefault">
                <div class="aid-user-infor">
                    <p>
                        <span class="aid-user-name" @click="toRuleDetail(aid.uid,aid.roleid,aid.merid )">{{aid.username }}</span>
                        <span class="aid-user-role">/{{getRole(aid.roleid)}}</span>
                    </p>
                    <p class="pro-user-date">{{getDateDiff(aid.occurTime)}}</p>
                </div>
            </div>
            <img v-if="aid.followStatus=='0'" @click="aidFollow(aid.id)" class="aid-follow" src="./img/aid_follow_on.png">
            <img v-else class="aid-follow" @click="aidFollow(aid.id)" src="./img/aid_follow_plus.png">
        </div>
        <p class="huimi-number">求助/悬赏绘米{{JSON.parse(aid.extradata).point}}</p>
        <p class="aid-text" v-html="aid.msgtxt"></p>
        <div class="img-list">
            <div v-for="(images,index) in aid.dynaImages" :key="index" :style="'background-image: url('+images.listImg+')' " @click="$preview($event, aid.dynaImages, index,'detailImg')">
            </div>
        </div>
        <p class="aid-infor">
            <span class="answerNum">{{JSON.parse(aid.extradata).ansCount }}人回答</span>
            <span>这条求助帮助{{JSON.parse(aid.extradata).helpCount }}人</span>
        </p>
        <div class="aid-bottom-div">
            <p class="aid-date">
                <span class="endTime">{{timeDisparity(JSON.parse(aid.extradata).endTime)}}</span>
            </p>
            <div class="aid-go-detail" @click="goAidDetail(aid.dataid)" v-if="JSON.parse(aid.extradata).acceptStatus=='0'">查看详情</div>
            <div class="aid-go-detail" @click="goAidDetail(aid.dataid)" v-else>回答</div>
        </div>
    </div>
</template>
<script>
import './aid.scss'
import config from '../../common/config.class'
import utils from '../../common/utils'
import followAid from '../../common/userFollowAid.class'
export default {
    name: 'aid',
    props: ['aid'],
    data() {
        return {
            avatarDefault: require('../images/default_head.png'),
        }
    },
    activated: function() {
        console.log(this.aid)

    },
    methods: {
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid) {
            return utils.toRuleDetail(this, uid, roleid, merid)
        },
        //跳转求助详情
        goAidDetail: function(id) {
            window.location.href = config.SERVERADD() + '/huihome/api/aid/detail/' + id + '.html'
        },
        //关注求助
        aidFollow: function(aid) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let FA = new followAid(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                aid: aid
            }
            FD.request(reqParamcom, this.aid.favStatus).then((res) => {
                console.log(res);
                if (res.body.respCode == "00") {
                    if (this.item.favStatus == 0) {
                        utils.vToast(res.body.respMsg, '关注成功')
                        this.item.favStatus = '1';
                    } else {
                        utils.vToast(res.body.respMsg, '取消关注成功')
                        this.item.favStatus = '0';
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Toast(e);
            })

        },
        timeDisparity: function(time) {
            return utils.timeDisparity(time)
        },
        getDateDiff: function(dateTimeStamp) {
            return utils.getDateDiff(dateTimeStamp);
        },
        getRole: function(roleId) {
            return utils.getRole(roleId);
        },
    },

}
</script>