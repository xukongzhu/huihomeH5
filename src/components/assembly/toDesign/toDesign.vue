<template>
    <div class="toDesign">
        <img @click="phone()" src="./img/zuopin_btn_kefu.png" />
        <img v-if="from=='pm'" @click="toPlease()" src="./img/gerenzhuye_btn_shigong.png" />
        <img @click="toPlease()" v-else-if="from=='desi'" src="./img/zuopin_btn_sheji.png" />
    </div>
</template>
<script>
import './toDesign.scss'
import utils from '../../../common/utils'
export default {
    props: ['targetUid', 'Share', 'from'],
    methods: {
        toPlease: function(designerid) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            this.$router.push({
                name: 'pleaseDesign',
                query: {
                    targetUid: this.targetUid,
                    shareUrl: this.Share.shareUrl,
                    shareTitle: this.Share.shareTitle,
                    shareDigest: this.Share.shareDigest,
                    shareImage: this.Share.shareImage,
                    pageTitle: this.Share.shareTitle,
                }
            })
        },
        //拨打电话号码
        phone: function() {
            window.location.href = 'tel:400-655-5695'
        },
    }
}
</script>

