<template>
    <div class="detail-bottom">
        <div class="com-input" @click="commentshow('0')">
            {{textPlaceholder1}}
        </div>
        <div @click="workAppraise()">
            <img :src="require(`../../images/btn_zan${appraiseType}.png`)" />
            <span :class="{'c3db8':appraiseType=='1'}">{{appraiseCount}}</span>
        </div>
        <div @click="commentshow('0')">
            <img src="../../images/btn_pinglun.png" />
            <span>{{commentCount}}</span>
        </div>
        <div v-if="!faHide" @click="workFavorite()">
            <img :src="require(`../../images/btn_shoucang${favoriteType}.png`)" />
            <span :class="{'c3db8':favoriteType=='1'}">{{favoriteCount}}</span>
        </div>
    </div>
</template>
<script>
import './detailBottom.scss'
import {
    Toast,
    Indicator
} from 'mint-ui';
import utils from '../../../common/utils'
import textPlaceholder from '../../../common/homeTextPlaceholder.class'
export default {
    props: ['appraiseType', 'favoriteType', 'appraiseCount', 'commentCount', 'favoriteCount', 'faHide'],
    data: function() {
        return {
            textPlaceholder1: Object
        }
    },
    created() {
        this.textPlaceholder()
    },
    methods: {
        textPlaceholder: function() {
            let CI = new textPlaceholder(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                usefor: '0'
            }
            Indicator.open({
                text: '加载中...',
            });
            CI.request(reqParamcom).then((res) => {
                console.log(res.body.body);
                this.textPlaceholder1 = res.body.body
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })

        },
        workAppraise: function() {
            this.$emit('workAppraise')
        },
        commentshow: function(cmtid) {
            this.$emit('commentshow', cmtid,'com')
        },
        workFavorite: function() {
            this.$emit('workFavorite')
        },
    },
}
</script>
