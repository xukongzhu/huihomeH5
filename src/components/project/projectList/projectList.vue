<template>
    <div class="project-list">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <div class="top">
                    <img src="http://image.huihome.cn/1807/03/PT_6f46dbc0-d887-4dc6-9308-2d567bd2e4a8.jpg" />
                    <img src="http://image.huihome.cn/1807/03/PT_6f46dbc0-d887-4dc6-9308-2d567bd2e4a8.jpg" />
                    <img src="http://image.huihome.cn/1807/03/PT_6f46dbc0-d887-4dc6-9308-2d567bd2e4a8.jpg" />
                    <img src="http://image.huihome.cn/1807/03/PT_6f46dbc0-d887-4dc6-9308-2d567bd2e4a8.jpg" />
                </div>
                <div class="subList">
                    <div class="subList-title">
                        <div>
                            <img src="./img/title.jpg" />
                            <span>热门话题</span>
                        </div>
                        <div @click="toSubList()">
                            <p>查看更多>></p>
                        </div>
                    </div>
                    <div class="sub-list-div">
                        <div class="sub-div" v-for="(item,index) in liveIndex.subjects" :key="index" :style="'background-image: url('+item.img0+')'" @click="toSubject(item.dataid)">
                            <div>#{{item.title}}#</div>
                        </div>
                    </div>
                </div>
                <div class="site-screen-div">
                    <div class="site-screen">
                        <div v-for="(option,index) in typeList" @click="typeClick(index)" :key="index" class="site-option" :class="{'select':index==parseInt(cate)}">{{option.name}}</div>
                    </div>
                    <div class="site-screen-right" @click="styleShowC()">
                        <img src="../../owner/img/shouye_btn_fenlei.png" />
                    </div>
                </div>
                <div v-if="JSON.stringify(liveIndex.dynaItems)!= '[]'" class="site-dynaItems-list">
                    <div v-for="(item,index) in liveIndex.dynaItems" :key="index">
                        <aidTop :from="'list'" v-if="item.datatype=='1'" :extradata="JSON.parse(item.extradata)" :item="item"></aidTop>
                        <assesses :from="'list'" v-else-if="item.datatype=='3'" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                        <dynamic v-else ref="dynamic" :index="index" :from="'list'" :dataid="item.id" :type="'1'" :item="item"></dynamic>
                    </div>
                </div>
                <myNone v-else></myNone>
                <mt-actionsheet :actions="styleList" v-model="styleShow" cancelText="取消">
                </mt-actionsheet>
            </mt-loadmore>
        </div>
    </div>
</template>
<script>
import './projectList.scss'
import utils from '../../../common/utils'
import aidTop from '../../assembly/aidTop/aidTop'
import menuTop from '../../assembly/menu/menu-top.vue'
import assesses from '../../assembly/assesses/assesses.vue'
import myNone from '../../my-none/my-none.vue'
import dynamic from '../../assembly/dynamic/dynamic'
import liveIndex from '../../../common/dynamic/dynamicLiveIndex.class'
import {
    Toast,
    Indicator,
    Actionsheet
} from 'mint-ui';
export default {
    data: function() {
        return {
            styleList: [],
            typeList: [],
            styleIndex: -1,
            styleShow: false,
            liveIndex: Object,
            pageIndex: 1,
            cate: 0,
            lastId: '-1',
            step: 0
        }
    },
    created() {
        let styleName = ['全部', '前期', '设计', '拆改', '水电', '泥工', '木工', '油漆', '完工', '软装', '入住']
        for (let i = 0; i < styleName.length; i++) {
            this.styleList.push({ 'name': styleName[i], 'method': this.styleClick })
        }
        let typeName = ['全部', '业主', '精华', '自己', '求助', '账单']
        for (let i = 0; i < typeName.length; i++) {
            this.typeList.push({ 'name': typeName[i], 'method': this.typeClick })
        }
    },
    mounted: function() {
        this.active();
    },

    methods: {
        active: function() {
            let OD = new liveIndex(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '-1',
                cate: this.cate,
                lastId: this.lastId,
                step: this.step - 1,
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
                    let start = res.body.body.dynaItems.length;
                    if (this.pageIndex > 2) {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.liveIndex.dynaItems.push(res.body.body.dynaItems[i])
                            }
                        }
                    } else {
                        this.liveIndex = res.body.body
                    }
                    if (start > 0) {
                        this.lastId = res.body.body.dynaItems[res.body.body.dynaItems.length - 1].id
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
        //跳转话题列表页
        toSubList: function() {
            this.$router.push({
                name: 'subjectList',
            })
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
        //类型筛选
        typeClick: function(index) {
            this.cate = index
            this.pageIndex = 1
            this.lastId = '-1'
            this.active()
        },
        //阶段筛选
        styleClick: function(actions, index) {
            this.step = index
            this.pageIndex = 1
            this.lastId = '-1'
            this.active()
        },
        //筛选阶段显示
        styleShowC: function() {
            this.styleShow = true;
        },
        //加载更多
        infinite: function() {
            this.active();
        },
        //刷新页面
        loadTop: function() {
            this.styleIndex = -1
            this.pageIndex = 1
            this.cate = 0
            this.lastId = '-1'
            this.step = 0
            this.active();
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
    },

    components: {
        dynamic,
        assesses,
        aidTop,
        myNone,
        menuTop
    },
}
</script>
