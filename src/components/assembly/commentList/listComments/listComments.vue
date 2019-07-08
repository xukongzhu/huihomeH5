<template>
    <div class="comment-list">
        <comment v-for="(items,index) in item.comments" :key="index" :index="index" :type="type" :dyid="item.id" @commentshow="commentshow" @delComment="delComment" :comment="items"></comment>

        <div v-if="item.comments&&item.commentCount>item.comments.length&&item.commentCount>3" class="comment-more" @click="toDetail(item.id)">
            查看更多评论<img src="../../../images/btn_pinglun_right.png" />
        </div>
        <commentTextarea v-show="commentHide" @commentHides="commentHides" @comSend="comSend" :comtxt="replyName" :index="index" :cmtid="cmtid" :type="type" :dataid="item.id"></commentTextarea>
    </div>
</template>
<script>
import '../commentList.scss'
import {
    Toast,
    Indicator
} from 'mint-ui'
import utils from '../../../../common/utils'
import commentTextarea from '../../commentTextarea/commentTextarea'
import comment from '../../comment/listComment/listComment'
import aidAnswerItem from '../../../../common/aid/aidAnswerItem.class'
import dynamicItem from '../../../../common/dynamic/dynamicDetailDynamicItem.class'
export default {
    props: ['item', 'type', 'dataid'],
    data() {
        return {
            commentIndex: 0,
            cmtid: '',
            replyIndex: '',
            commentHide: false,
            replyName: '',
            index: ''
        }
    },

    methods: {
        toDetail: function(id) {
            console.log(id);
            if (this.type == '6') {
                this.$router.push({
                    name: 'aidAnswer',
                    query: {
                        ansid: id
                    }
                })
            } else {
                this.$router.push({
                    name: 'dynamicDetail',
                    query: {
                        dyid: id
                    }
                })
            }
        },
        //删除评论
        delComment: function(index) {
            if (index === '') {
                this.item.commentCount = parseInt(this.item.commentCount) - 1
            }
            this.dynamicItem(this.item.id);
        },
        commentHides: function() {
            this.commentHide = false;
        },
        //评论框弹出事件
        commentshow: function(cmtid, index, comindex, replyName) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            this.replyIndex = comindex
            this.cmtid = cmtid
            this.commentHide = true;
            this.index = index
            if (index == 'com') {
                this.replyName = ''
            } else {
                this.replyName = '回复' + replyName
            }
        },
        //回复或者回复提交响应事件
        comSend: function(data) {
            if (!this.replyIndex && this.replyIndex != 0) {
                if (this.item.comments.length >= 3) {
                    this.item.comments.pop();
                }
                this.item.comments.unshift(data)
                this.item.commentCount = parseInt(this.item.commentCount) + 1
                this.$emit('count', 'comment', '', this.item.commentCount)
            } else {
                if (this.item.comments[this.replyIndex].subItems.length >= 1) {
                    this.item.comments[this.replyIndex].subItems.pop()
                }
                this.item.comments[this.replyIndex].subItems.unshift(data)
                this.item.comments[this.replyIndex].subCount = parseInt(this.item.comments[this.replyIndex].subCount) + 1
            }
            this.commentHide = false
        },
        answerItem: function(ansid) {
            let AA = new aidAnswerItem(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId || '-1',//loginUser.serialNo,   
                ansid: ansid,//loginUser.uid,
                withinDetail: '0'
            }
            Indicator.open({
                text: '加载中...',
            });
            AA.request(reqParamcom).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.item.comments = res.body.body.answers[0].comments
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        dynamicItem: function(dyid) {
            let AA = new dynamicItem(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId || '-1',//loginUser.serialNo,   
                dyid: dyid,//loginUser.uid,
                withinDetail: '0'
            }
            Indicator.open({
                text: '加载中...',
            });
            AA.request(reqParamcom).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.item.comments = res.body.body.comments
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
    },
    components: {
        comment,
        commentTextarea
    },

}
</script>
