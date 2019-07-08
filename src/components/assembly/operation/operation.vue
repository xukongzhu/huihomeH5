<template>
    <div class="pro-operation-div">
        <div class="pro-operation-option pro-operation-like" @click="appraise()">
            <img v-if="item.appraiseStatus=='1'" src="../../images/btn_zan1.png">
            <img v-else src="../../images/icon_zan.png">
            <span v-if="parseInt(item.appraiseCount)<100" :class="{'c3db8':item.appraiseStatus=='1'}">赞 {{item.appraiseCount }}</span>
            <span v-else :class="{'c3db8':item.appraiseStatus=='1'}">赞 99+</span>
        </div>
        <div class="pro-operation-option pro-operation-comment" @click="commentshow('0')">
            <img src="../../images/icon_pinglun.png">
            <span v-if="parseInt(item.commentCount)<100">评论 {{item.commentCount }}</span>
            <span v-else>评论 99+</span>
        </div>
        <div class="pro-operation-option pro-operation-collection" @click="favorite()" v-if="item.datatype!='3'&&item.datatype!='1'">
            <img v-if="item.favStatus=='1'" src="../../images/dibu_btn_yishoucang.png">
            <img v-else src="../../images/shoucangshu.png">
            <span v-if="parseInt(item.favCount)<100" :class="{'c3db8':item.favStatus=='1'}">收藏 {{item.favCount }}</span>
            <span v-else :class="{'c3db8':item.appraiseStatus=='1'}">收藏 99+</span>
        </div>
    </div>
</template>
<script>
import {
    Toast,
    Indicator
} from 'mint-ui';
import utils from '../../../common/utils'
import './operation.scss'
import appraiseDynamic from '../../../common/dynamic/appraiseDynamic.class'
import favoriteDynamic from '../../../common/dynamic/favoriteDynamic.class'
import aidAgree from '../../../common/aid/aidAgree.class'
export default {
    props: ['item', 'type'],
    data() {
        return {
        }
    },
    methods: {
        //点赞事件
        appraise: function() {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            if (this.type == '6') {
                let AA = new aidAgree(this)
                let loginUser = utils.getLoginData('loginUserAuthToken');
                let reqParamcom = {
                    uid: loginUser.userId,//loginUser.uid,
                    serialNo: loginUser.serialNo,//loginUser.serialNo,
                    authCode: loginUser.authCode,//loginUser.authCode,
                    answerid: this.item.id
                }
                Indicator.open({
                    text: '提交中...',
                });
                AA.request(reqParamcom, this.item.appraiseStatus).then((res) => {
                    Indicator.close();
                    if (res.body.respCode == "00") {
                        if (this.item.appraiseStatus == 0) {
                            Toast('点赞成功')
                        } else {
                            Toast('取消点赞成功')
                        }
                        this.item.appraises = res.body.body.appraises
                        this.item.appraiseStatus = res.body.body.appraiseStatus
                        this.item.appraiseCount = res.body.body.appraiseCount
                        this.$emit('count', 'appraises', this.item.appraiseStatus, this.item.appraiseCount)
                    } else {
                        Toast(res.body.respMsg)
                    }
                }).catch((e) => {
                    Indicator.close();
                    Toast(e);
                })

            } else {
                let AD = new appraiseDynamic(this)
                let loginUser = utils.getLoginData('loginUserAuthToken');
                let reqParamcom = {
                    uid: loginUser.userId,//loginUser.uid,
                    serialNo: loginUser.serialNo,//loginUser.serialNo,
                    authCode: loginUser.authCode,//loginUser.authCode,
                    dyId: this.item.id
                }
                Indicator.open({
                    text: '提交中...',
                });
                AD.request(reqParamcom, this.item.appraiseStatus).then((res) => {
                    Indicator.close();
                    if (res.body.respCode == "00") {
                        if (this.item.appraiseStatus == 0) {
                            Toast('点赞成功')
                        } else {
                            Toast('取消点赞成功')
                        }
                        this.item.appraises = res.body.body.appraises
                        this.item.appraiseStatus = res.body.body.appraiseStatus
                        this.item.appraiseCount = res.body.body.appraiseCount
                        this.$emit('count', 'appraises', this.item.appraiseStatus, this.item.appraiseCount)
                    } else {
                        Toast(res.body.respMsg)
                    }
                }).catch((e) => {
                    Indicator.close();
                    Toast(e);
                })
            }
        },
        //收藏事件
        favorite: function() {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let FD = new favoriteDynamic(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                dyid: this.item.id
            }
            Indicator.open({
                text: '提交中...',
            });
            FD.request(reqParamcom, this.item.favStatus).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.item.favStatus == 0) {
                        Toast('收藏成功')
                        this.item.favStatus = '1';
                        this.item.favCount = parseInt(this.item.favCount) + 1
                    } else {
                        Toast('取消收藏成功')
                        this.item.favStatus = '0';
                        this.item.favCount = parseInt(this.item.favCount) - 1
                    }
                    this.$emit('count', 'favorite', this.item.favStatus, this.item.favCount)
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //评论框弹出事件
        commentshow: function(cmtid) {
            this.$emit('commentshow', cmtid, 'com')
        },
    }
}
</script>

