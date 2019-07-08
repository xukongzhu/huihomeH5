<template>
    <div class="work-div">
        <div class="work-img-list" @click="toWorkDetail(item.id)">
            <div class="left-img-div" v-if="item.images[0]" :style="'background-image: url('+item.images[0].listImg||workDefault+')' ">
                <div>
                    <span>{{ item.houseType }}</span>
                    <span>|</span>
                    <span>{{item.decoStyle}}</span>
                    <span>|</span>
                    <span>{{item.houseArea}}m²</span>
                    <span>|</span>
                    <span>{{item.fee}}元/m²</span>
                </div>
            </div>
            <div class="left-img-div" v-else :style="'background-image: url('+workDefault+')' ">
                <div>
                    <span>{{ item.houseType }}</span>
                    <span>|</span>
                    <span>{{item.decoStyle}}</span>
                    <span>|</span>
                    <span>{{item.houseArea}}m²</span>
                    <span>|</span>
                    <span>{{item.fee}}元/m²</span>
                </div>
            </div>
            <div class="right-img-list">
                <div class="right-img-div" v-if="item.images[1]" :style="'background-image: url('+item.images[1].listImg||workDefault+')' ">
                </div>
                <div class="right-img-div" v-else :style="'background-image: url('+workDefault+')' ">
                </div>
                <div class="right-img-div" v-if="item.images[2]" :style="'background-image: url('+item.images[2].listImg||workDefault+')' ">
                    <div v-if="parseInt(item.picCount)-3>0">
                        +{{parseInt(item.picCount)-3}}
                    </div>
                </div>
                <div class="right-img-div" v-else :style="'background-image: url('+workDefault+')' ">
                </div>
            </div>
        </div>
        <div class="work-infor">
            <p class="work_name" @click="toWorkDetail(item.id)">{{item.workname}}</p>
            <div class="work-oprea">
                <div class="work-data">
                    <img src="../../images/read.png">
                    <span>{{item.clickCount }}</span>
                    <img src="../../images/icon_zan.png">
                    <span>{{item.appraiseCount }}</span>
                    <img src="../../images/icon_fenxiang.png">
                    <span>{{item.shareCount }}</span>
                    <img src="../../images/icon_pinglun.png">
                    <span>{{item.commentCount }}</span>
                </div>
                <div class="work_project_jump" v-if="item.projid!=''&&item.projid!='null'&&item.projid!='0'" @click="toProjectDetail(item.projid)">查看工地直播</div>
            </div>
            <div class="rule-infor" v-if="from=='list'&&item.designerid" @click="toRuleDetail(item.designerid,'1',item.merid)">
                <img :src="item.designerAvatar||avatarDefault" />
                <p>{{item.designerName}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import './workDiv.scss'
import utils from '../../../common/utils'
export default {
    props: ['item', 'from'],
    data() {
        return {
            avatarDefault: require('../../images/default_head.png'),
            workDefault: require('./img/default_work.png'),
        }
    },
    methods: {
        toWorkDetail: function(id) {
            this.$router.push({
                name: 'workDetail',
                query: {
                    workid: id
                }
            })
        },
        toProjectDetail: function(id) {
            this.$router.push({
                name: 'projectDetail',
                query: {
                    projid: id
                }
            })
        },
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid) {
            return utils.toRuleDetail(this, uid, roleid, merid)
        },

    }
}
</script>
