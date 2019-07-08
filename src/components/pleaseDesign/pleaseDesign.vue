<template>
    <div class="pleaseDesign">
        <p>小区名称：</p>
        <input v-model="reqParam.village" placeholder="请填写您房屋所在楼盘或小区的名称" />

        <p>房屋户型：</p>
        <div class="design-option" @click="houseShowC()">
            <span>{{reqParam.houseType}}</span>
            <div>
            </div>
        </div>
        <p>房屋面积：</p>
        <div class="posiAbs">
            <input type="number" v-model="reqParam.houseArea" placeholder="请填写您房屋的面积" />
            <span>m²</span>
        </div>
        <p>期望风格：</p>
        <div class="design-option" @click="styleShowC()">
            <span>{{reqParam.decoStyle}}</span>
            <div>
            </div>
        </div>
        <p>预&nbsp;&nbsp;&nbsp;&nbsp;算：</p>
        <div class="design-option" @click="areaShowC()">
            <span>{{reqParam.budget}}</span>
            <div>
            </div>
        </div>
        <div class="sub" @click="submit()">
            免费在线预约
        </div>
        <mt-actionsheet :actions="house" v-model="houseShow" cancelText="">
        </mt-actionsheet>
        <mt-actionsheet :actions="style" v-model="styleShow" cancelText="">
        </mt-actionsheet>
        <mt-actionsheet :actions="area" v-model="areaShow" cancelText="">
        </mt-actionsheet>
    </div>
</template>
<script>
import './pleaseDesign.scss'
import {
    Toast,
    Indicator,
    Actionsheet
} from 'mint-ui'
import dictInit from '../../common/dictInit.class'
import userReserve from '../../common/userReserve.class'
import Vue from "vue"
import utils from '../../common/utils'
Vue.component(Actionsheet.name, Actionsheet);
export default {
    data() {
        return {
            house: [],
            houseShow: false,
            style: [],
            styleShow: false,
            area: [],
            areaShow: false,
            reqParam: {
                uid: utils.getLoginData('loginUserAuthToken').userId || '',
                serialNo: utils.getLoginData('loginUserAuthToken').serialNo || '',
                authCode: utils.getLoginData('loginUserAuthToken').authCode || '',
                targetUid: this.$route.query.targetUid,
                village: '',
                houseType: '请选择您的房屋户型',
                houseArea: '',
                decoStyle: '请选择您希望的装修风格',
                budget: '请选择您的装修预算',
            },
        }
    },
    activated: function() {
        console.log(this.$route.query.pageTitle)
        let DI = new dictInit(this)
        let reqParam = {
            cate: ''
        }
        DI.request(reqParam).then((res) => {
            if (res.body.respCode == "00") {
                for (let i = 0; i < res.body.body.house.length; i++) {
                    this.house.push({
                        'name': res.body.body.house[i].value,
                        'method': this.houseClick,
                    })
                }
                for (let i = 0; i < res.body.body.style.length; i++) {
                    this.style.push({
                        'name': res.body.body.style[i].value,
                        'method': this.styleClick,
                    })
                }
                for (let i = 0; i < res.body.body.budget.length; i++) {
                    this.area.push({
                        'name': res.body.body.budget[i].value,
                        'method': this.areaClick,
                    })
                }

            }
        }).catch((e) => {
            Toast(e);
        })

        let Share = {
            shareUrl: this.$route.query.shareUrl,
            shareTitle: this.$route.query.shareTitle,
            shareDigest: this.$route.query.shareDigest,
            shareImage: this.$route.query.shareImage,
            pageTitle: this.$route.query.shareTitle,
        }

        if (!utils.isLocalEnv()) {
            utils.wxShare(this, Share)
        } else {
            utils.APPshare(this, Share)
        }
    },
    methods: {
        //表单提交事件
        submit: function() {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            if (this.reqParam.village == '') {
                Toast('请填写您房屋所在楼盘或小区的名称')
                return
            } else if (!this.reqParam.houseType || this.reqParam.houseType == '' || this.reqParam.houseType == '请选择您的房屋户型') {
                Toast('请选择您的房屋户型')
                return
            } else if (this.reqParam.houseArea == '') {
                Toast('请填写您房屋的面积')
                return
            } else if (this.reqParam.decoStyle == '' || this.reqParam.decoStyle == '请选择您希望的装修风格') {
                Toast('请选择您希望的装修风格')
                return
            }
            else if (this.reqParam.budget == '' || this.reqParam.budget == '请选择您的装修预算') {
                Toast('请选择您的装修预算')
                return
            }
            let UR = new userReserve(this)
            Indicator.open({
                text: '提交中...',
            });
            UR.request(this.reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    utils.vToast(res.body.respMsg, '预约成功');
                    this.$router.go(-1)
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //显示选项框
        houseShowC: function() {
            // 打开action sheet
            this.houseShow = true;
        },
        styleShowC: function() {
            // 打开action sheet
            this.styleShow = true;
        },
        areaShowC: function() {
            // 打开action sheet
            this.areaShow = true;
        },
        //选项框选择事件
        houseClick: function(actions, index) {
            this.reqParam.houseType = actions.name
        },
        styleClick: function(actions, index) {
            this.reqParam.decoStyle = actions.name
        },
        areaClick: function(actions, index) {
            this.reqParam.budget = actions.name
        },
    }
}
</script>
