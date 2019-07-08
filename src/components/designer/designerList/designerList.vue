<template>
    <div class="designer-list">

        <div class="pr">
            <div class="desi-list-top">
                <div class="df">
                    <p :class="{'select':deSelect==1}" @click="scrDesi(1)">作品</p>
                    <p :class="{'select':deSelect==2}" @click="scrDesi(2)">设计师</p>
                </div>
                <div class="df">
                    <div :class="{'a38':(deSelect==1&&sortByStr=='hot')||(deSelect==2&&(desortByStr=='assess'||desortByStr=='hot'))}" @click="sortBy()">
                        排序
                        <img v-if="(deSelect==1&&sortByStr=='hot')||(deSelect==2&&(desortByStr=='assess'||desortByStr=='hot'))" src="./img/tab_btn_paixu2.png" />
                        <img v-else src="./img/tab_btn_paixu.png" />
                    </div>
                    <div :class="{'a38':(deSelect==1&&catesStr!='')||(deSelect==2&&decatesStr!='')}" @click="cates()">
                        筛选
                        <img v-if="(deSelect==1&&catesStr!='')||(deSelect==2&&decatesStr!='')" src="./img/nav_btn_shuaixuan2.png" />
                        <img v-else src="./img/tab_btn_shuaixuan.png" />
                    </div>
                </div>
            </div>
            <div :class="'sortBy sort'+sortByShow" v-if="deSelect==1">
                <div @click="sortByClick('time')" :class="{'select':sortByStr=='time'}">时间从远到近
                    <img v-if="sortByStr=='time'" src="./img/tab_btn_xuanz.png" />
                </div>
                <div @click="sortByClick('hot')" :class="{'select':sortByStr=='hot'}">热度从高到低
                    <img v-if="sortByStr=='hot'" src="./img/tab_btn_xuanz.png" /></div>
            </div>
            <div :class="'sortBy sort'+desortByShow" v-else-if="deSelect==2">
                <div @click="sortByClick('')" :class="{'select':desortByStr==''}">综合
                    <img v-if="desortByStr==''" src="./img/tab_btn_xuanz.png" />
                </div>
                <div @click="sortByClick('assess')" :class="{'select':desortByStr=='assess'}">评价从高到低
                    <img v-if="desortByStr=='assess'" src="./img/tab_btn_xuanz.png" />
                </div>
                <div @click="sortByClick('hot')" :class="{'select':desortByStr=='hot'}">热度从高到低
                    <img v-if="desortByStr=='hot'" src="./img/tab_btn_xuanz.png" /></div>
            </div>
        </div>
        <div v-if="deSelect==1&&workList3&&workList3.length>0">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <div v-if="workList3&&workList3.length>0">
                    <workDiv v-for="(item,index) in workList3" :item="item" :from="'list'" :key="index"></workDiv>
                </div>
                <myNone v-else></myNone>
            </mt-loadmore>
        </div>
        <div v-if="deSelect==2">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <div v-if="designerList&&designerList.length>0">
                    <ruleDiv  v-for="(item,index) in designerList" from="'design'" :item="item" :key="index"></ruleDiv>
                </div>
                <myNone v-else></myNone>
            </mt-loadmore>
        </div>
        <div class="shadow" v-show="sortByShow=='bottom'&&deSelect==1" @click="sortByShow='top'"></div>
        <div class="shadow" v-show="desortByShow=='bottom'&&deSelect==2" @click="desortByShow='top'"></div>
    </div>
</template>
<script>
import {
    Toast,
    Indicator,
} from 'mint-ui';
import utils from '../../../common/utils'
import './designerList.scss'
import ruleDiv from '../../assembly/ruleDiv/ruleDiv'
import workDiv from '../../work/workDiv/workDiv'
import myNone from '../../my-none/my-none.vue'
import workList3 from '../../../common/work/workList3.class'
import designerIndex4 from '../../../common/designer/designerIndex4.class'
import userFollow from '../../assembly/userFollow/userFollow'
export default {
    data: function() {
        return {
            workList3: [],
            designerList: [],
            pageIndex: 1,
            depageIndex: 1,
            deSelect: 1,
            sortByShow: '',
            sortByStr: 'time',
            catesStr: '',
            desortByShow: '',
            desortByStr: '',
            decatesStr: '',
            avaDefault: require('./img/morentouxiang.png')
        }
    },
    mounted() {
        this.active();
    },
    methods: {
        emptiness: function(str, defaultStr) {
            return utils.emptiness(str, defaultStr)
        },
        active: function() {
            let WL = new workList3(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                pageIndex: this.pageIndex,
                pageSize: '10',
                cates: this.catesStr,
                sortBy: this.sortByStr
            }
            Indicator.open({
                text: '加载中...'
            });
            WL.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.pageIndex++
                    let start = res.body.body.works.length;
                    if (this.pageIndex > 2) {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.workList3.push(res.body.body.works[i])
                            }
                        }
                    } else {
                        this.workList3 = res.body.body.works
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
        //作品排序点击事件
        sortByClick: function(str) {
            if (this.deSelect == 1) {
                if (this.sortByStr == str) {
                    return
                } else {
                    this.sortByStr = str
                    this.pageIndex = 1
                    this.active();
                    this.sortByShow = 'top'
                }
            } else {
                if (this.desortByStr == str) {
                    return
                } else {
                    this.desortByStr = str
                    this.depageIndex = 1
                    this.designerIndex4();
                    this.desortByShow = 'top'
                }
            }
        },
        //接受从父页面传递过来的方法（给筛选字符串赋值）
        catesClick: function(str) {
            if (this.deSelect == 1) {
                this.catesStr = str
                this.pageIndex = 1
                this.active();
            } else {
                this.decatesStr = str
                this.depageIndex = 1
                this.designerIndex4()
            }
        },
        //设计师列表数据加载
        designerIndex4: function() {
            let WL = new designerIndex4(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '',
                pageIndex: this.depageIndex,
                pageSize: '10',
                cates: this.decatesStr,
                sortBy: this.desortByStr,
            }
            Indicator.open({
                text: '加载中...'
            });
            WL.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.depageIndex++
                    console.log(res)
                    let start = res.body.body.designers.length;
                    if (this.depageIndex > 2) {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.designerList.push(res.body.body.designers[i])
                            }
                        }
                    } else {
                        this.designerList = res.body.body.designers
                    }
                    this.loading = true
                } else {
                    Toast(res.body.respMsg)
                }
                if (this.depageIndex > 2) {
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded();
                    }, 500)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //作品设计师切换
        scrDesi: function(index) {
            if (this.deSelect == index) {
                return
            }
            this.$emit('deSelectSwitch', this.deSelect)
            if (this.deSelect == 1) {
                if (this.desortByShow == 'top') {
                    this.desortByShow = ''
                }
                this.deSelect = 2
                if (this.designerList == '') {
                    this.designerIndex4();
                }
            } else {
                if (this.sortByShow == 'top') {
                    this.sortByShow = ''
                }
                this.deSelect = 1
            }
        },
        //筛选点击展开事件
        cates: function() {
            this.$emit('cates')
        },
        //排序方式点击展开事件
        sortBy: function() {
            if (this.deSelect == 1) {
                if (this.sortByShow == 'top' || this.sortByShow == '') {
                    this.sortByShow = 'bottom'
                } else {
                    this.sortByShow = 'top'
                }
            } else if (this.deSelect == 2) {
                if (this.desortByShow == 'top' || this.desortByShow == '') {
                    this.desortByShow = 'bottom'
                } else {
                    this.desortByShow = 'top'
                }
            }
        },
        
        //加载更多
        infinite: function() {
            if (this.deSelect == 1) {
                this.active();
            } else {
                this.designerIndex4();
            }
        },
        //刷新页面
        loadTop: function() {
            if (this.deSelect == 1) {
                this.pageIndex = 1
                this.active();
            } else {
                this.depageIndex = 1
                this.designerIndex4();
            }
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
    },
    components: {
        workDiv,
        myNone,
        userFollow,
        ruleDiv
    },
}
</script>
