<template>
    <div class="rule-div">
        <div class="designer-avatar" :style="'background-image: url('+emptiness(item.sAvatar,avaDefault)+')'">
            <div v-if="from=='design'">
                设计费：{{item.feeLow}}-{{item.feeHigh}}元/m²
            </div>
        </div>
        <div class="designer-infor">
            <div class="df">
                <div class="df-div">
                    <div class="designer-name">
                        <p>{{item.realname}}</p>
                        <p>/{{item.city}}</p>
                    </div>
                    <p class="designer-cell">{{item.cellname}}</p>
                </div>
                <userFollow @follow="follow" :statusErro="true" :index="index" :followStatus="item.followStatus" :userid="item.uid"></userFollow>
            </div>
            <p class="goodAt" v-if="from=='design'">擅长：{{item.decoStyle}}</p>
            <p class="describe">{{item.slogan}}</p>
            <div class="df1">
                <div class="stars-div">
                    <stars :starsObj="{score:item.totalScore,maxScore:5}"></stars>
                    <span>{{item.totalScore.toFixed(1) }}</span>
                </div>
                <p>工地{{item.caseCount}}个</p>
            </div>
        </div>
    </div>
</template>
<script>
import './ruleDiv.scss'
import utils from '../../../common/utils'
import userFollow from '../userFollow/userFollow'
import stars from '../stars/stars'
export default {
    props: ['item', 'index', 'from'],
    data: function() {
        return {
            avaDefault: require('./img/morentouxiang.png')
        }
    },
    methods: {
        emptiness: function(str, defaultStr) {
            console.log(this.item.sAvatar)
            return utils.emptiness(str, defaultStr)
        },
        //响应子组件的用户关注事件处理(由于接口原因，followStatus参数与动态相反了)
        follow: function(index, respMsg) {
            if (this.item.followStatus == '1') {
                utils.vToast(respMsg, '取消关注成功')
                this.item.followStatus = '0'
            } else {
                utils.vToast(respMsg, '关注成功')
                this.item.followStatus = '1'
            }
        },
    },
    components: {
        stars,
        userFollow
    },
}
</script>
