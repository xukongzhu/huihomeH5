<template>
    <div class="shops-obj">
        <img class="shops-logo" @click="toShop(item.id)" :src="item.merlogo">
        <div class="shop-info">
            <div class="shops-eva-infor" @click="toShop(item.id)">
                <p class="shops-eva-title">{{item.mername }} </p>
                <p class="shops-eva-describe">主营：{{item.goods }}</p>
                <div class="shop-ensure">
                    <div v-if="item.grade" class="gold-medal">{{item.grade }}</div>
                    <div v-if="item.assure" class="ensure">{{item.assure}}</div>
                    <div class="site-assess">
                        <stars :starsObj="{score:item.totalScore ,maxScore:5}"></stars>
                        <span>{{item.totalScore.toFixed(1)}}</span>
                    </div>
                </div>
            </div>
            <div class="pro-follow" @click="follow(item.id )">
                <img v-if="item.followStatus=='0'" src="../../images/zhibo_btn_guanzhu.png" />
                <img v-else src="../../images/btn_yiguanzhu.png" />
                <p v-if="item.followStatus=='0'">关注</p>
                <p v-else class="c8">已关注</p>
            </div>
        </div>
    </div>
</template>
<script>
import './shopsObj.scss'
import utils from '../../../common/utils'
import {
    Toast,
    Indicator
} from 'mint-ui';
import config from '../../../common/config.class'
import stars from '../stars/stars.vue'
import userFollow from '../../../common/userFollow.class'
export default {
    props: ['item'],
    data() {
        return {

        }
    },
    methods: {
        toShop: function(id) {
            return utils.toRuleDetail(this, '', '7', id)
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

