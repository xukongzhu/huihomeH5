<template>
    <div class="subject-list">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <div class="sub-div" v-for="(item,index) in subjectList" :key="index" @click="toSubject(item.item.id)">
                    <div class="sub-img" v-if="item.item.ugcFlag =='1'" :style="'background-image: url('+emptiness(item.item.bannerImg,defaultbanner)+')'">
                    </div>
                    <div class="sub-img" v-else-if="item.item.ugcFlag =='0'" :style="'background-image: url('+emptiness(item.item.logoImg,defaultbanner)+')'">
                    </div>
                    <p class="sub-title">{{item.item.name}}</p>
                    <p class="sub-txt">{{item.item.digest }}</p>
                    <div class="sub-click">
                        <img src="../../images/read.png" />
                        <span>{{item.item.clickCount }}</span>
                    </div>
                    <div class="sub-userList">
                        <div>
                            <img v-if="index<4" v-for="(items,index) in item.dy.avatar" :key="index" :src="emptiness(items.avatar,avatarDefault)" />
                            <p v-if="parseInt(item.dy.num)>4">&nbsp;&nbsp;···</p>
                            <p>&nbsp;&nbsp;{{item.dy.num}}人参与讨论</p>
                        </div>
                        <div @click="toSubject(item.item.id)">参与话题 >></div>
                    </div>
                </div>
            </mt-loadmore>
        </div>
    </div>
</template>
<script>
import './subjectList.scss'
import {
    Toast,
    Indicator,
    Actionsheet
} from 'mint-ui';
import utils from '../../../common/utils'
import menuTop from '../../assembly/menu/menu-top.vue'
import subjectList from '../../../common/subject/subjectList.class'
export default {
    data: function() {
        return {
            subjectList: Object,
            pageIndex: 1,
            avatarDefault: require('../../images/default_head.png'),
            defaultbanner: require('../subjectDetai/img/huati_bg.png')
        }
    },
    mounted: function() {
        this.active();
    },
    methods: {
        emptiness: function(str, defaultStr) {
            return utils.emptiness(str, defaultStr)
        },
        active: function() {
            let OD = new subjectList(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                name: '',
                pageIndex: this.pageIndex,
                pageSize: '10'
            }
            Indicator.open({
                text: '加载中...'
            });
            OD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.pageIndex++
                    console.log(res)
                    let start = res.body.body.items.length;
                    if (this.pageIndex > 2) {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.subjectList.push(res.body.body.items[i])
                            }
                        }
                    } else {
                        this.subjectList = res.body.body.items
                    }
                } else {
                    Toast(res.body.respMsg)
                }

                if (this.pageIndex > 2) {
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded();
                    }, 500)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //加载更多
        infinite: function() {
            this.active();
        },
        //刷新页面
        loadTop: function() {
            this.pageIndex = 1
            this.active();
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
        //跳转话题详情页面
        toSubject: function(id) {
            this.$router.push({
                name: 'subjectDetai',
                query: {
                    subId: id,
                }
            })
        },
    },
    components: {
        menuTop
    },
}
</script>
