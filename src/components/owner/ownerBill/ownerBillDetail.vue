<template>
    <div class="ownerBill-detail">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore">
                <div v-if="detailBillList&&detailBillList.length>0">
                    <div v-for="(item,index) in detailBillList" :key="index">
                        <dynamic ref="dynamic" :from="'list'" :index="index" :dataid="item.id" :type="'1'" :item="item"></dynamic>
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
import './ownerBillDetail.scss'
import utils from '../../../common/utils'
import config from '../../../common/config.class'
import shopsObj from '../../assembly/shopsObj/shopsObj'
import dynamic from '../../assembly/dynamic/dynamic'
import menuTop from '../../assembly/menu/menu-top.vue'
import detailBill from '../../../common/owner/ownerDetailBill.class'
export default {
    data: function() {
        return {
            detailBillList: Object,
        }
    },
    activated: function() {
        this.active();
    },
    methods: {
        active: function() {
            let OD = new detailBill(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '-1',
                ownerid: this.$route.query.ownerid,
                feeType: this.$route.query.feeType,
            }
            Indicator.open({
                text: '加载中...'
            });
            OD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.detailBillList = res.body.body.dynaItems
                    console.log(this.detailBillList)
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
        menuTop,
        dynamic
    }
}
</script>
