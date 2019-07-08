<template>
    <div class="user-follow" @click="follow(userid)">
        <div v-if="statusErro">
            <img v-if="followStatus=='0'" src="../../images/zhibo_btn_guanzhu.png" />
            <img v-else src="../../images/btn_yiguanzhu.png" />
            <p v-if="followStatus=='0'">关注</p>
            <p v-else class="c8">已关注</p>
        </div>
        <div v-else>
            <img v-if="followStatus=='1'" src="../../images/zhibo_btn_guanzhu.png" />
            <img v-else src="../../images/btn_yiguanzhu.png" />
            <p v-if="followStatus=='1'">关注</p>
            <p v-else class="c8">已关注</p>
        </div>
    </div>
</template>
<script>
import './userFollow.scss'
import utils from '../../../common/utils'
import {
    Toast,
    Indicator
} from 'mint-ui';
import userFollow from '../../../common/userFollow.class'
export default {
    props: ['followStatus', 'userid', 'index', 'statusErro'],
    methods: {
        follow: function(targetUid) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let UF = new userFollow(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let follow = ''
            if (this.statusErro) {
                if (this.followStatus == '0') {
                    follow = '1'
                } else {
                    follow = '0'
                }
            } else {
                follow = this.followStatus
            }
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                targetUid: targetUid
            }
            Indicator.open({
                text: '提交中...'
            });
            UF.request(reqParamcom, follow).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.$emit('follow', this.index, res.body.respMsg)
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        }
    },
}
</script>
