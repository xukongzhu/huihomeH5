<template>
    <div class="shops-list">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore">
                <shopsObj v-for="(item,index) in moremerchant" :item="item" :key="index"></shopsObj>
            </mt-loadmore>
        </div>
    </div>
</template>
<script>
import {
    Toast,
    Indicator,
} from 'mint-ui';
import './shopsList.scss'
import utils from '../../common/utils'
import config from '../../common/config.class'
import shopsObj from '../assembly/shopsObj/shopsObj'
import menuTop from '../assembly/menu/menu-top.vue'
import moremerchant from '../../common/shop/moremerchant.class'
export default {
    data: function() {
        return {
            moremerchant: []
        }
    },
    activated: function() {
        this.active();
    },
    methods: {
        active: function() {
            let OD = new moremerchant(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '-1',
                projId: this.$route.query.projid,
                pageSize: '-1',
                pageIndex: '1'
            }
            Indicator.open({
                text: '加载中...'
            });
            OD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.moremerchant = res.body.body.merchants
                    console.log(this.moremerchant.merchants)
                    // let shareUrl = ''
                    // if (!utils.isLocalEnv()) {
                    //     shareUrl = config.SERVERADD() + '/huihomeH5/#/shopsList?projid=' + this.$route.query.projid + '&shareUid=' + utils.getUrlParam('shareUid')
                    // } else {
                    //     shareUrl = ''
                    // }
                    // utils.publicShare(this, res.body.body, shareUrl)
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        loadTop: function() {
            this.active();
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        }
    },
    components: {
        shopsObj,
        menuTop
    }
}
</script>
