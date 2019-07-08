<template>
    <div class="site-pro-content" v-if="!del">
        <assesses v-if="item.datatype=='3'" :type="types||type" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
        <dynamicContent ref="dynamicContent" v-else @adopt="adopt" :index="index" :type="types||type" :tab="tab" :from="from" @proDel="proDel" :item="item" :awardPoint="awardPoint" :acceptStatus="acceptStatus" :accept="accept" :expireTime="expireTime" :uid="uid"></dynamicContent>
        <operation :item="item" ref="operation" :type="types||type" @count="count" @commentshow="commentshow" :acceptStatus="acceptStatus"></operation>
        <exhibition :item="item" ref="exhibition" :type="types||type" :from="from"></exhibition>
    </div>
</template>
<script>
import './dynamic.scss'
import utils from '../../../common/utils'
import assesses from '../assesses/assesses.vue'
import dynamicContent from '../dynamicContent/dynamicContent'
import operation from '../operation/operation'
import exhibition from '../exhibition/exhibition'
export default {
    props: ['item', 'awardPoint', 'expireTime', 'acceptStatus', 'accept', 'uid', 'from', 'type', 'index','tab'],
    data() {
        return {
            avatarDefault: require('../../images/default_head.png'),
            dyId: '',
            cmtid: '',
            commentHide: false,
            replyIndex: '',
            moreShow: false,
            types: '',
            del: false
        }
    },
    methods: {
        playerPlaying: function(player) {
            this.$emit('playerPlaying', player)
        },
        //评论框弹出事件
        commentshow: function(cmtid, index) {
            this.$refs.exhibition.commentshow(cmtid, index)
        },
        favorite: function() {
            this.$refs.operation.favorite();
        },
        //组件传递过来的点赞事件传入operation组件中处理
        appraise: function() {
            this.$refs.operation.appraise();
        },
        //获取operation组件传递的count事件
        count: function(type, status, num) {
            this.$emit('count', type, status, num)
        },
        adopt: function(data) {
            this.$emit('adopt', data)
        },
        //刷新调用或者需要初始化页面的时候调用
        Init: function(dataid, type) {
            this.types = type
            this.$refs.exhibition.Init(dataid, type)
        },
        //直播删除
        proDel: function() {
            this.del = true
        }
    },

    components: {
        dynamicContent,
        operation,
        exhibition,
        assesses

    },
}
</script>

