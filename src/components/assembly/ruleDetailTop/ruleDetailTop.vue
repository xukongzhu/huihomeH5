<template>
    <div class="ruleTop" :style="'background-image: url('+banner(topObj.bannerImg)+')' ">
        <div class="rule-infor">
            <div class="owner-infor">
                <div class="owner-left">
                    <img class="owner-avatar" :src="topObj.owneravatar||avatarDefault" @click="df()" />
                    <div class="df">
                        <img v-for="(item,index) in x1" :key="index" v-if="Math.floor(topObj.totalScore)>0&&index<Math.floor(topObj.totalScore)" src="./img/evaluate_1.png">
                        <img v-if="Math.ceil(topObj.totalScore) - Math.floor(topObj.totalScore) > 0" src="./img/evaluate_2.png">
                    </div>
                    <div class="df">
                        <img v-for="(item,index) in x1" :key="index" v-if="Math.ceil(topObj.totalScore)>0&&index<5-Math.ceil(topObj.totalScore)" src="./img/evaluate_3.png">
                    </div>
                </div>
                <div class="owner-data-infor" :class="{'owner-data-my':uid!=topObj.uid}">
                    <div class="owner-data-div" v-if="uid==topObj.uid">
                        <p>{{topObj.huimiCount}}</p>
                        <p>绘米</p>
                    </div>
                    <div v-if="uid==topObj.uid" class="interval"></div>
                    <div class="owner-data-div" @click="tofollow(topObj.uid,'1')">
                        <p>{{topObj.followCount}}</p>
                        <p>关注</p>
                    </div>
                    <div class="interval"></div>
                    <div class="owner-data-div" @click="tofollow(topObj.uid,'0')">
                        <p>{{topObj.followedCount}}</p>
                        <p>被关注</p>
                    </div>
                </div>
            </div>
            <div class="ruleTop-bottom">
                <div class="user-name">
                    <p>{{name(topObj.name)}}/
                        <span>{{topObj.role}}</span>
                    </p>
                    <div class="rule-cell" v-if="topObj.cellName">
                        {{topObj.cellName}}
                    </div>
                </div>
                <div>
                    <div class="fee-div">
                        <div class="fee" v-if="topObj.feeLow&&topObj.feeHigh">
                            <img src="./img/icon_shoufeibiaozhun.png" />
                            <span>{{topObj.feeLow}}-{{topObj.feeHigh}}元/m²</span>
                        </div>
                    </div>
                    <div class="df">
                        <div v-if="topObj.expYear">
                            <img src="./img/icon_congyejingyan.png" />
                            <span>从业经验{{topObj.expYear}}年</span>
                        </div>
                        <div>
                            <img src="./img/icon_dizhi.png" />
                            <span>{{topObj.city}}</span>
                        </div>
                    </div>
                    <div class="rule-operation">
                        <div @click="toresume(topObj.uid)">
                            TA的故事
                        </div>
                        <div v-if="uid!=topObj.uid&&topObj.followStatus=='0'" class="ownerTop-follow" @click="follow(topObj.uid)">已关注</div>
                        <div v-else-if="uid!=topObj.uid&&topObj.followStatus!='0'" class="ownerTop-follow" @click="follow(topObj.uid)">+ 关注</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import './ruleDetailTop.scss'
import config from '../../../common/config.class'
import utils from '../../../common/utils'
import {
    Toast,
    Indicator
} from 'mint-ui';
import userFollow from '../../../common/userFollow.class'
import stars from '../stars/stars'
export default {
    props: ['topObj'],
    data: function() {
        return {
            avatarDefault: require('../../images/default_head.png'),
            bannerDefault: require('../../images/default_banner.png'),
            uid: '-1',
            x1: [
                require('./img/evaluate_1.png'),
                require('./img/evaluate_2.png'),
                require('./img/evaluate_3.png'),
                require('./img/evaluate_1.png'),
                require('./img/evaluate_1.png'),
            ],
            x2: [
                require('./img/evaluate_1.png'),
                require('./img/evaluate_2.png'),
                require('./img/evaluate_3.png'),
                require('./img/evaluate_1.png'),
                require('./img/evaluate_1.png'),
            ]
        }
    },
    created() {
        this.uid = utils.getLoginData('loginUserAuthToken').userId
        console.log(this.topObj)
        for (let i = 0; i < Math.floor(this.topObj.totalScore); i++) {
            this.x1.push(1)
        }
        if (Math.floor(this.topObj.totalScore) - Math.ceil(this.topObj.totalScore) > 0) {
            this.x1.push(2)
        }
        for (let i = 0; i < Math.ceil(this.topObj.totalScore); i++) {
            this.x1.push(3)
        }
    },
    methods: {
        df: function() {
            console.log(this.x1)
        },
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
        toresume: function(id) {
            window.location.href = config.SERVERADD() + '/huihome/api/user/resume/' + id + '-fwap.html';
        },
        getRole: function(roleId) {
            return utils.getRole(roleId);
        },
        getLoginData: function(name) {
            return utils.getLoginData(name)
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
            UF.request(reqParamcom, this.topObj.followStatus).then((res) => {
                Indicator.close();
                console.log(res.body.respMsg);
                if (res.body.respCode == "00") {
                    if (this.topObj.followStatus == 0) {
                        utils.vToast(res.body.respMsg, '取消关注成功')
                        this.topObj.followStatus = '1'
                        this.topObj.followedCount = parseInt(this.topObj.followedCount) - 1
                    } else {
                        utils.vToast(res.body.respMsg, '关注成功')
                        this.topObj.followStatus = '0'
                        this.topObj.followedCount = parseInt(this.topObj.followedCount) + 1
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
        stars
    }
}
</script>

