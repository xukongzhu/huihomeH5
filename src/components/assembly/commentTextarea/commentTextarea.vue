<template>
    <div class="comment-textarea">
        <div class="comment-content">
            <div class="comment-top">
                <div @click="commentHides()">取消</div>
                <div>评论</div>
                <div @click="commentSend()" class="c3d">发送</div>
            </div>
            <textarea class="com" v-model="msgTxt" rows="5" @blur="inputBlur()" @change="inputFous()" :placeholder="comtxt||$store.state.textPlaceholder1"></textarea>
        </div>
    </div>
</template>
<script>
import './commentTextarea.scss'
import {
    Toast,
    Indicator
} from 'mint-ui';
import utils from '../../../common/utils'
import issueComment from '../../../common/comment/issueComment.class'
import commentDynamic2 from '../../../common/dynamic/commentDynamic2.class'
import textPlaceholder from '../../../common/homeTextPlaceholder.class'
export default {
    props: ['cmtid', 'index', 'type', 'dataid', 'aid', 'comtxt'],
    data: function() {
        return {
            msgTxt: "",
            textPlaceholder: '快来说点什么吧',
            abs: false,
            // inputTimer: null
        }
    },

    methods: {
        // viewAll: function() {
        //     this.inputTimer = setInterval(() => {
        //        // this.$refs.replyInput.scrollIntoView(false);
        //     }, 100);
        // },
        // viewDefault: function() {
        //     clearInterval(this.inputTimer);
        // },
        commentHides: function() {
            this.$emit('commentHides')
        },
        clear: function() {
            this.msgTxt = ''
        },
        inputFous: function() {
            window.scroll(0, 0);
        },
        inputBlur: function() {
            window.scroll(0, 0);
        },
        //用户评论发送事件
        commentSend: function() {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            if (this.aid == 'aid') {
                this.$emit('answeriSend', this.msgTxt)
            } else {
                let IC = new issueComment(this)
                let loginUser = utils.getLoginData('loginUserAuthToken');
                if (this.msgTxt == '') {
                    Toast('评论内容不能为空')
                    return
                }

                let reqParamcom = {
                    uid: loginUser.userId,//loginUser.uid,
                    serialNo: loginUser.serialNo,//loginUser.serialNo,
                    authCode: loginUser.authCode,//loginUser.authCode,
                    datatype: this.type,
                    dataid: this.dataid,
                    cmtid: this.cmtid || '0',
                    msgtxt: this.msgTxt
                }
                Indicator.open({
                    text: '提交中...',
                });
                IC.request(reqParamcom).then((res) => {
                    Indicator.close();
                    if (res.body.respCode == "00") {
                        if (this.index == 'com') {
                            utils.vToast(res.body.respMsg, '评论成功')
                        } else {
                            utils.vToast(res.body.respMsg, '回复成功')
                        }
                        this.msgTxt = ''
                        this.commentHides()
                        this.$emit('comSend', res.body.body.item)
                    } else {
                        Toast(res.body.respMsg)
                    }
                }).catch((e) => {
                    Indicator.close();
                    Toast(e);
                })
            }
        }
    },
}
</script>

