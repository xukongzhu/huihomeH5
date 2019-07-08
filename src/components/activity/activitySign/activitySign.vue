<template>
    <div class="activity-sign">
        <div class="forward-region">
            <p class="forward-title">报&nbsp;名&nbsp;专&nbsp;区</p>
            <ul>
                <li>
                    <span>姓&nbsp;&nbsp;&nbsp;名</span>
                    <input v-model="username" type="text" placeholder="请输入您的称呼">
                </li>
                <li>
                    <span>手&nbsp;&nbsp;&nbsp;机</span>
                    <input class="mobile" v-model="mobile" type="tel" placeholder="请输入您的手机号码">
                </li>
                <li>
                    <span>验证码</span>
                    <input type="tel" v-model="verifyCode" placeholder="请输入验证码">
                    <button v-if="ve98==0" @click="verification()">获取验证码</button>
                    <button v-else class="ve98">获取验证码</button>
                </li>
                <li>
                    <span>楼&nbsp;&nbsp;&nbsp;盘</span>
                    <input v-model="village" type="text" placeholder="请填写您房屋所在楼盘/小区">
                </li>
                <li>
                    <div class="forward-sign" @click="activityApply2()">
                        立即报名
                    </div>
                </li>
            </ul>
        </div>
        <div class="forward-logo-div">
            <img class="forward-logo" src="./img/icon-bgtext.png">
        </div>

    </div>
</template>
<script>
import './activitySign.scss'
import utils from '../../../common/utils'
import config from '../../../common/config.class'
import genverifycode2 from '../../../common/user/userGenverifycode2.class'
import activityApply2 from '../../../common/activity/activityApply2.class'
import activityDetail from '../../../common/activity/activityDetail.class'
import {
    Toast,
    Indicator
} from 'mint-ui'
export default {
    data: function() {
        return {
            verifyCode: '',
            ve98: 0,
            activityDetail: Object,
            mobile: this.$route.query.mobile,
            username: this.$route.query.username,
            village: this.$route.query.village,
        }
    },
    activated: function() {
        this.active();
    },
    mounted() {
        window.addEventListener('message', (e) => {
            this.veShow = false;
            if (e.data.id !== 'huihome-captcha' || e.origin !== 'https://api.huihome.cn') {
                return
            }
            switch (e.data.type) {
                case 'success':
                    setTimeout(() => {
                        document.getElementsByClassName('activity-sign')[0].removeChild(document.getElementsByClassName('ve-iframe')[0])
                    }, 500);
                    let GF = new genverifycode2(this)
                    let loginUser = utils.getLoginData('loginUserAuthToken');
                    let reqParamcom = {
                        mobile: document.getElementsByClassName('mobile')[0].value,
                        usefor: 'bind',
                        sessionId: e.data.body.sessionId,
                        sig: e.data.body.sig,
                        token: e.data.body.token,
                        scene: e.data.body.scene,
                        platform: '3'
                    }
                    Indicator.open({
                        text: '短信发送中...',
                    });
                    GF.request(reqParamcom).then((res) => {
                        Indicator.close();
                        if (res.body.respCode == "00") {
                            Toast('验证码已发送，请注意查收')
                            this.ve98 = 1
                        } else {
                            Toast(res.body.respMsg)
                        }
                    }).catch((e) => {
                        Indicator.close();
                        Toast(e);
                    })
                    return
                case 'error':
                    setTimeout(() => {
                        document.getElementsByClassName('activity-sign')[0].removeChild(document.getElementsByClassName('ve-iframe')[0])
                    }, 500);
                    return
                case 'fail':
                    return
                case 'refresh':
                    return
            }
        })
    },
    methods: {
        active: function() {
            let AD = new activityDetail(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '',
                serialNo: loginUser.serialNo || '',
                authCode: loginUser.authCode || '',
                activityid: this.$route.query.activityid,
            }
            Indicator.open({
                text: '加载中...'
            });
            AD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.activityDetail = res.body.body

                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/activityDetail?activityid=' + this.$route.query.activityid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = ''
                    }
                    utils.publicShare(this, res.body.body, shareUrl, '报名专区')
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        verification: function() {
            if (this.mobile == '' || this.mobile == 'null' || this.mobile == null) {
                Toast('号码不能为空')
                return;
            }
            let iframe = document.createElement('iframe');
            iframe.src = "https://api.huihome.cn/captcha";
            iframe.className = 've-iframe'
            document.getElementsByClassName('activity-sign')[0].appendChild(iframe);
        },
        activityApply2: function() {
            let AA = new activityApply2(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            if (this.username == '' || this.username == null || this.username == 'null') {
                Toast('请输入您的称呼')
                return;
            }
            if (this.mobile == '' || this.mobile == null || this.mobile == 'null') {
                Toast('请输入您的手机号码')
                return;
            }
            if (this.verifyCode == '' || this.verifyCode == null || this.verifyCode == 'null') {
                Toast('请输入验证码')
                return;
            }
            if (this.village == '' || this.village == null || this.village == 'null') {
                Toast('请输入您房屋所在楼盘')
                return;
            }
            let reqParamcom = {
                activityid: this.$route.query.activityid,
                applicant: this.username,
                mobile: this.mobile,
                village: this.village,
                verifyCode: this.verifyCode,
                shareUrl:config.SERVERADD() + '/huihomeH5/#/activityDetail?activityid=' + this.$route.query.activityid + '&shareUid=' + utils.getUrlParam('shareUid'),
                shareUid:this.$route.query.shareUid,
            }
            Indicator.open({
                text: '提交中...',
            });
            AA.request(reqParamcom).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    utils.vToast(res.body.respMsg, '报名成功')
                    this.$router.go(-1)
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
    },
}
</script>
