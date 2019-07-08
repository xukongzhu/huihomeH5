<template>
    <div class="dycomment list-comment">
        <img class="comment-avatar" @click="toRuleDetail(comment.user.uid,comment.user.roleid,comment.user.merid )" :src="comment.user.avatar||avatarDefault" />
        <img v-if="comment.user.proveStatus=='0'" class="huihome-v" src="../../../images/zhibo_icon_vip.png">
        <div class="comment-infor">
            <div class="comment-user-infor">
                <div>
                    <p class="username" @click="toRuleDetail(comment.user.uid,comment.user.roleid,comment.user.merid )">{{comment.user.name}}/{{comment.user.userRank}}</p>
                    <p class="userdata">{{getDateDiff(comment.occurTime) }}</p>
                </div>
                <div class="comment-opera" v-if="comment.datastatus=='0'">
                    <div @click="commentshow(comment.id,'',index,comment.user.name)">回复 ·</div>
                    <div @click="likecomment(comment.id,comment.liked,'')">
                        <img v-if="comment.liked=='0'" src="../../../images/icon_zan.png" />
                        <img v-else src="../../../images/btn_zan1.png" />
                        <span v-if="comment.likeCount!='0'&&parseInt(comment.likeCount)<100" :class="{'c3db8':comment.liked=='1'}">{{comment.likeCount}}</span>
                        <span v-else-if="comment.likeCount!='0'&&parseInt(comment.likeCount)>=100" :class="{'c3db8':comment.liked=='1'}">99+</span>
                        <span v-else>赞</span>
                    </div>
                </div>
            </div>
            <p class="comment-txt" v-html="Trim(comment.msgtxt)" @click="delComment(comment.id,comment.user.uid,comment.datastatus,'',index,comment.user.name)"></p>
            <div v-if="comment.subItems.length>0" class="comment-reply">
                <div class="case-sanjiao"></div>
                <div v-for="(item,index1) in comment.subItems" :key="index1" class="reply-infor">
                    <div class="reply-userinfor">
                        <div class="df">
                            <p class="reply-username" @click="toRuleDetail(item.user.uid,item.user.roleid,item.user.merid )">{{item.user.name }}
                                <span v-show="item.user.uid==comment.user.uid">（作者）</span>/{{item.user.userRank}}:</p>
                            <p class="reply-txt" @click="delComment(item.id,item.user.uid,item.datastatus,index1,index,item.user.name)">
                                <span v-if="item.toUser">回复
                                    <span class="toUsername">{{item.toUser.name}}/{{item.toUser.userRank}}</span>：</span>
                                <span v-if="item.msgtxt" v-html="Trim(item.msgtxt)"></span>
                            </p>
                        </div>
                    </div>
                </div>
                <div @click="toDetail(dyid)" v-if="comment.subCount>1&&comment.subCount>comment.subItems.length" class="reply-more">共{{comment.subCount}}条回复<img src="./img/pinglun_btn_right1.png" /></div>
            </div>
        </div>
    </div>
</template>
<script>
import './listComment.scss'
import '../comment.scss'
import {
    Toast,
    Indicator,
    MessageBox
} from 'mint-ui'
import utils from '../../../../common/utils'

import likecomment from '../../../../common/comment/likeComment.class'
import commentItem from '../../../../common/comment/commentItem.class'
import delComment from '../../../../common/comment/delComment.class'
export default {
    name: 'comment',
    props: ['comment', 'dyid', 'index', 'type'],
    data() {
        return {
            avatarDefault: require('../../../images/default_head.png'),
        }
    },
    methods: {
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid) {
            console.log(this.comment)
            return utils.toRuleDetail(this, uid, roleid, merid)
        },
        Trim: function(str) {  //str表示要转换的字符串
            return utils.Trim(str)
        },
        getRole: function(roleId) {
            return utils.getRole(roleId);
        },
        getDateDiff: function(data) {
            return utils.getDateDiff(data);
        },
        //用户点击自己的评论或者回复删除事件（index为回复下标，comindex为评论下标，index为空时表示一层评论对应事件）
        delComment: function(cmtid, uid, datastatus, index, comindex, replyName) {
            if (datastatus < 0) {
                return
            }
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let loginUser = utils.getLoginData('loginUserAuthToken');
            if (loginUser.userId == uid) {
                let delconent = ''
                if (index === '') {
                    delconent = '你确定要删除这条评论吗'
                } else {
                    delconent = '你确定要删除这条回复吗'
                }
                MessageBox.confirm(delconent).then(action => {
                    let DC = new delComment(this)
                    let reqParamcom = {
                        uid: loginUser.userId,//loginUser.uid,
                        serialNo: loginUser.serialNo,//loginUser.serialNo,
                        authCode: loginUser.authCode,//loginUser.authCode,
                        datatype: this.type,
                        cmtid: cmtid
                    }
                    Indicator.open({
                        text: '提交中...',
                    });
                    DC.request(reqParamcom).then((res) => {
                        Indicator.close();
                        if (res.body.respCode == "00") {
                            if (index === '') {
                                utils.vToast(res.body.respMsg, '删除评论成功')
                            } else {
                                utils.vToast(res.body.respMsg, '删除回复成功')
                            }
                            this.$emit('delComment', index)
                        } else {
                            Toast(res.body.respMsg)
                        }
                    }).catch((e) => {
                        Indicator.close();
                        Toast(e);
                    })
                });
            } else {
                if (index === '') {
                    this.$emit('commentshow', cmtid, index, comindex, replyName)
                }
            }
        },


        toDetail: function(id) {
            this.$router.push({
                name: 'dynamicDetail',
                query: {
                    dyid: id
                }
            })
        },
        commentshow: function(cmtid, index, comindex, replyName) {
            this.$emit('commentshow', cmtid, index, comindex, replyName)
        },
        //点赞评论或者回复事件
        likecomment: function(cmtid, liked, index) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let LC = new likecomment(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                cmtid: cmtid,
                datatype: this.type
            }
            Indicator.open({
                text: '提交中...',
            });
            LC.request(reqParamcom, liked).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (index === '') {
                        if (liked == '0' || liked == 0) {
                            utils.vToast(res.body.respMsg, '点赞成功')
                            this.comment.likeCount = parseInt(this.comment.likeCount) + 1
                            this.comment.liked = '1'
                        } else {
                            utils.vToast(res.body.respMsg, '取消点赞成功')
                            this.comment.likeCount = parseInt(this.comment.likeCount) - 1
                            this.comment.liked = '0'
                        }
                    } else {
                        if (liked == '0' || liked == 0) {
                            utils.vToast(res.body.respMsg, '点赞成功')
                            this.comment.subItems[index].likeCount = parseInt(this.comment.subItems[index].likeCount) + 1
                            this.comment.subItems[index].liked = '1'
                        } else {
                            utils.vToast(res.body.respMsg, '取消点赞成功')
                            this.comment.subItems[index].likeCount = parseInt(this.comment.subItems[index].likeCount) - 1
                            this.comment.subItems[index].liked = '0'
                        }
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })

        },
    },

}
</script>