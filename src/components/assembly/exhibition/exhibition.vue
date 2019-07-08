<template>
    <div class="pro-exhibition">
        <div class="rewardORlike" v-if="(item.gifts&&item.gifts.length>0)||(item.appraises&&item.appraises.length>0)">
            <div class="pro-reward" v-if="item.gifts.length>0">
                <img src="../../images/shouye_yisang.png">
                <p>
                    <span v-for="(gifts,index) in item.gifts" @click="toRuleDetail(gifts.uid,gifts.roleid,item.merid,item.projid)" :key="index">{{gifts.username||gifts.name }},</span>
                </p>
            </div>
            <div class="pro-like" v-if="item.appraises.length>0">
                <img src="../../images/btn_zan1.png">
                <p>
                    <span v-for="(appraises ,index) in item.appraises" @click="toRuleDetail(appraises.uid,appraises.roleid,appraises.merid )" :key="index">{{appraises.username||appraises.name}};</span>
                </p>
            </div>
        </div>
        <listComments v-if="from=='list'" ref="listComments" :type="type" :item="item"></listComments>
        <commentList v-else ref="commentList" :item="item"></commentList>
    </div>
</template>
<script>
import './exhibition.scss'
import {
    Toast,
    Indicator
} from 'mint-ui';
import utils from '../../../common/utils'
import listComments from '../commentList/listComments/listComments'
import commentList from '../commentList/commentList'
export default {
    props: ['item', 'listComment', 'from', 'type'],
    data() {
        return {

        }
    },

    methods: {
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid) {
            return utils.toRuleDetail(this, uid, roleid, merid)
        },
        //输入框显示事件
        commentshow: function(cmtid, index) {
            if (this.from == 'list') {
                this.$refs.listComments.commentshow(cmtid, index)
            } else {
                this.$refs.commentList.commentshow(cmtid, index)
            }
        },
        //刷新调用或者需要初始化页面的时候调用
        Init: function(dataid, type) {
            this.$refs.commentList.Init(dataid, type)
        },
    },
    components: {
        commentList,
        listComments
    },
}
</script>