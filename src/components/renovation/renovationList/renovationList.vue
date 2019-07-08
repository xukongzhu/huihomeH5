<template>
    <div class="renovation-list">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <mt-navbar class="d1" :class="'d1'+$store.state.menutopShow" v-model="selected">
            <mt-tab-item class="d1-option" id="1">
                工作室
                <div class="tab-item-bottom">
                </div>
            </mt-tab-item>
            <mt-tab-item class="d1-option" id="2">
                设计
                <div class="tab-item-bottom">
                </div>
            </mt-tab-item>
            <mt-tab-item class="d1-option" id="3">
                施工
                <div class="tab-item-bottom">
                </div>
            </mt-tab-item>
        </mt-navbar>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-tab-container v-model="selected" :swipeable="true">
                <mt-tab-container-item class="cell-list" id="1">
                    <ceList></ceList>
                </mt-tab-container-item>
                <mt-tab-container-item class="design-list" id="2">
                    <designList ref="designList" @cates="cates" @deSelectSwitch="deSelectSwitch"></designList>
                </mt-tab-container-item>
                <mt-tab-container-item class="pm-list" id="3">
                     <pmList ref="designList" @cates="cates" @deSelectSwitch="deSelectSwitch"></pmList>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>

        <div :class="'cates 1 cates'+catesObj.catesShow" v-if="deSelect==2">
            <div class="cates-title">
                作品筛选
            </div>
            <div class="cates-content">
                <div class="cates-div">
                    <p>面积 (㎡)</p>
                    <div class="cates-list">
                        <div v-for="(item,index) in dictInitList.area" :key="index" :class="{'select':comparCates(item.code)}" @click="addCatesStr(item.code)">{{item.value}}</div>
                    </div>
                </div>
                <div class="cates-div">
                    <p>户型</p>
                    <div class="cates-list">
                        <div v-for="(item,index) in dictInitList.house" :key="index" :class="{'select':comparCates(item.code)}" @click="addCatesStr(item.code)">{{item.value}}</div>
                    </div>
                </div>
                <div class="cates-div">
                    <p>风格</p>
                    <div class="cates-list">
                        <div v-for="(item,index) in dictInitList.style" :key="index" :class="{'select':comparCates(item.code)}" @click="addCatesStr(item.code)">{{item.value}}</div>
                    </div>
                </div>
                <div class="cates-div">
                    <p>设计费 (元/㎡)</p>
                    <div class="cates-list">
                        <div v-for="(item,index) in dictInitList.dfee" :key="index" :class="{'select':comparCates(item.code)}" @click="addCatesStr(item.code)">{{item.value}}</div>
                    </div>
                </div>
            </div>
            <div class="cates-confirmation">
                <div @click="resetCates()">重置</div>
                <div @click="confirmation()">确认</div>
            </div>
        </div>
        <div :class="'cates cates'+cates2Obj.catesShow" v-else>
            <div class="cates-title">
                设计师筛选
            </div>
            <div class="cates-content">
                <div class="cates-div">
                    <p>工地数 (个)</p>
                    <div class="cates-list">
                        <div v-for="(item,index) in dictInitList.pmcase" :key="index" :class="{'select':comparCates(item.code)}" @click="addCatesStr(item.code)">{{item.value}}</div>
                    </div>
                </div>
                <div class="cates-div">
                    <p>从业经验 (年)</p>
                    <div class="cates-list">
                        <div v-for="(item,index) in dictInitList.work" :key="index" :class="{'select':comparCates(item.code)}" @click="addCatesStr(item.code)">{{item.value}}</div>
                    </div>
                </div>
                <div class="cates-div">
                    <p>风格</p>
                    <div class="cates-list">
                        <div v-for="(item,index) in dictInitList.style" :key="index" :class="{'select':comparCates(item.code)}" @click="addCatesStr(item.code)">{{item.value}}</div>
                    </div>
                </div>
                <div class="cates-div">
                    <p>设计费 (元/㎡)</p>
                    <div class="cates-list">
                        <div v-for="(item,index) in dictInitList.dfee" :key="index" :class="{'select':comparCates(item.code)}" @click="addCatesStr(item.code)">{{item.value}}</div>
                    </div>
                </div>
            </div>
            <div class="cates-confirmation">
                <div @click="resetCates()">重置</div>
                <div @click="confirmation()">确认</div>
            </div>
        </div>

        <div class="catesShadow" v-if="deSelect==2" v-show="catesObj.catesShow=='left'" @click="catesObj.catesShow='right'"></div>
        <div class="catesShadow" v-else v-show="cates2Obj.catesShow=='left'" @click="cates2Obj.catesShow='right'"></div>
    </div>
</template>
<script>
import {
    Toast,
    Indicator,
    Navbar,
    TabItem,
    TabContainer,
    TabContainerItem,
} from 'mint-ui';
import './renovationList.scss'
import utils from '../../../common/utils'
import menuTop from '../../assembly/menu/menu-top.vue'
import ceList from '../../cell/cellList/cellList'
import designList from '../../designer/designerList/designerList'
import pmList from '../../pm/pmList/pmList'
import dictInit from '../../../common/dictInit.class'
export default {
    data: function() {
        return {
            selected: '1',
            catesObj: {
                catesStr: [],
                catesShow: '',
            },
            cates2Obj: {
                catesStr: [],
                catesShow: '',
            },
            dictInitList: Object,
            deSelect: 2
        }
    },
    mounted() {
        this.dictInit();
    },
    methods: {

        //设计师跟作品列表切换
        deSelectSwitch: function(deindex) {
            if (deindex == 1 && this.cates2Obj.catesStr == 'top') {
                this.cates2Obj.catesStr = ''
            } else if (deindex == 2 && this.catesObj.catesStr == 'top') {
                this.catesObj.catesStr = ''
            }
            this.deSelect = deindex
        },
        //作品筛选确定事件
        confirmation: function() {
            if (this.deSelect == 2) {
                this.catesObj.catesShow = 'right'
                var cates = ''
                for (let i = 0; i < this.catesObj.catesStr.length; i++) {
                    if (cates == '') {
                        cates = this.catesObj.catesStr[i]
                    } else {
                        cates += ',' + this.catesObj.catesStr[i]
                    }
                }
                this.$refs.designList.catesClick(cates);
            } else {
                this.cates2Obj.catesShow = 'right'
                var cates2 = ''
                for (let i = 0; i < this.cates2Obj.catesStr.length; i++) {
                    if (cates2 == '') {
                        cates2 = this.cates2Obj.catesStr[i]
                    } else {
                        cates2 += ',' + this.cates2Obj.catesStr[i]
                    }
                }
                this.$refs.designList.catesClick(cates2);
            }
        },
        //作品筛选重置事件
        resetCates: function() {
            if (this.deSelect == 2) {
                this.catesObj.catesStr = []
            } else {
                this.cates2Obj.catesStr = []
            }
        },
        //比对作品选中
        comparCates: function(code) {
            if (this.deSelect == 2) {
                for (let i = 0; i < this.catesObj.catesStr.length; i++) {
                    if (this.catesObj.catesStr[i] == code) {
                        return true
                    }
                }
                return false
            } else {
                for (let i = 0; i < this.cates2Obj.catesStr.length; i++) {
                    if (this.cates2Obj.catesStr[i] == code) {
                        return true
                    }
                }
                return false
            }
        },
        //作品筛选选中事件
        addCatesStr: function(code) {
            if (this.deSelect == 2) {
                if (this.comparCates(code)) {
                    this.catesObj.catesStr.splice(this.catesObj.catesStr.indexOf(code), 1);
                } else {
                    this.catesObj.catesStr.push(code)
                }
            } else {
                if (this.comparCates(code)) {
                    this.cates2Obj.catesStr.splice(this.cates2Obj.catesStr.indexOf(code), 1);
                } else {
                    this.cates2Obj.catesStr.push(code)
                }
            }
        },
        //筛选点击展开事件
        cates: function() {
            if (this.deSelect == 2) {
                if (this.catesObj.catesShow == 'right' || this.catesObj.catesShow == '') {
                    this.catesObj.catesShow = 'left'
                } else {
                    this.catesObj.catesShow = 'right'
                }
            } else {
                if (this.cates2Obj.catesShow == 'right' || this.cates2Obj.catesShow == '') {
                    this.cates2Obj.catesShow = 'left'
                } else {
                    this.cates2Obj.catesShow = 'right'
                }
            }
        },

        //初始化作品筛选区域
        dictInit: function() {
            let DI = new dictInit(this)
            let reqParam = {
                cate: ''
            }
            DI.request(reqParam).then((res) => {
                if (res.body.respCode == "00") {
                    this.dictInitList = res.body.body
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Toast(e);
            })
        },
        //初始化作品筛选区域
        dictInit2: function() {
            let DI = new dictInit(this)
            let reqParam = {
                cate: ''
            }
            DI.request(reqParam).then((res) => {
                if (res.body.respCode == "00") {
                    console.log(res)
                    this.dictInitList = res.body.body
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Toast(e);
            })
        },
    },
    components: {
        Navbar,
        TabItem,
        TabContainer,
        TabContainerItem,
        menuTop,
        ceList,
        designList,
        pmList
    }
}
</script>
