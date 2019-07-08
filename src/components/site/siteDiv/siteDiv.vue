<template>
    <div class="site-div">
        <div class="site-img-div" @click="toProject(item.id)" :style="'background-image: url('+item.doneImg||workDefault+')' ">
            <div>
                <span>{{item.price}}万</span>
                <span>|</span>
                <span>{{item.mode}}</span>
                <span>·</span>
                <span>进度</span>
                <span>|</span>
                <span>{{item.phase}}</span>
            </div>
        </div>
        <div class="site-infor">
            <p class="site-name" @click="toProject(item.id)">{{item.projname}}</p>
            <div class="site-place">
                <img src="../../images/place.png" />
                <span>{{item.village}}/{{item.city}}</span>
            </div>
            <p class="site-data">
                <span v-if="item.designerid" @click="toRuleDetail(item.designerid,'1',item.merid)">设计师·{{item.designerName }} |</span>
                <span v-if="item.houseType">{{item.houseType}} |</span>
                <span v-if="item.houseArea">{{item.houseArea}}m² |</span>
                <span v-if="item.decoStyle">{{item.decoStyle}}</span>
            </p>
            <div class="site-user-infor" v-if="item.pmid">
                <img :src="item.pmAvatar " />
                <p>{{item.pmName}}</p>
            </div>
            <div class="rule-infor" v-if="from=='pm'&&item.designerid" @click="toRuleDetail(item.designerid,'1',item.merid)">
                <img :src="item.designerAvatar||avatarDefault" />
                <p>{{item.designerName}}</p>
            </div>
            <div class="rule-infor" v-else-if="from!='pm'&&item.pmid" @click="toRuleDetail(item.pmid,'2',item.merid)">
                <img :src="item.pmAvatar||avatarDefault" />
                <p>{{item.pmName}}</p>
            </div>
        </div>
    </div>
</template>
<script >
import './siteDiv.scss'
import utils from '../../../common/utils'
import config from '../../../common/config.class'
export default {
    props: ['item', 'from'],
    data: function() {
        return {
            workDefault: require('../../work/workDiv/img/default_work.png'),
            avatarDefault: require('../../images/default_head.png'),
        }
    },
    methods: {
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid) {
            return utils.toRuleDetail(this, uid, roleid, merid)
        },
        toProject: function(id) {
            this.$router.push({
                name: 'projectDetail',
                query: {
                    projid: id,
                }
            })
        }
    }
}
</script>
