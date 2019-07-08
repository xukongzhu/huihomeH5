<template>
    <div class="comment-list">
        <comment v-for="(items,index) in listComment" :key="index" :index="index" :type="type" :dyid="item.id" @commentshow="commentshow" @delComment="delComment" :comment="items"></comment>

        <div v-if="Initnum>=10&&listComment.length<item.commentCount" class="comment-more" @click="commentMore(commentIndex)">
            查看更多评论<img src="../../images/pinglun_btn_gengduo.png" />
        </div>
        <div v-else-if="Initnum>=10&&listComment.length>=item.commentCount" class="comment-more" @click="commentMore(0)">
            收起更多评论<img src="../../images/zhibo_btn_pinglun_right2.png" />
        </div>
        <commentTextarea v-show="commentHide" @commentHides="commentHides" @comSend="comSend" :comtxt="replyName" :index="index" :dyId="item.id" :cmtid="cmtid" :type="type" :dataid="dataid"></commentTextarea>
    </div>
</template>
<script>
import './commentList.scss'
import {
    Toast,
    Indicator
} from 'mint-ui';
import utils from '../../../common/utils'
import commentTextarea from '../commentTextarea/commentTextarea'
import listComment from '../../../common/comment/listComment.class'
import comment from '../comment/comment'
export default {
    props: ['item'],
    data() {
        return {
            commentIndex: 0,
            num: 10,
            Initnum: 0,
            cmtid: '',
            replyIndex: '',
            commentHide: false,
            listComment: Object,
            dataid: '',
            type: '1',
            replyName: '',
            index: ''
        }
    },

    methods: {
        commentMore: function(commentIndex) {
            if (!commentIndex) {
                commentIndex = 0
            }
            this.commentIndex = commentIndex
            let LC = new listComment(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.commentIndex++
            let reqParam1 = {
                uid: loginUser.userId || '-1',
                dataid: this.dataid,
                datatype: this.type,
                pageIndex: this.commentIndex || '1',
                pageSize: "10"
            }
            Indicator.open({
                text: '加载中...',
            });
            LC.request(reqParam1).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (!this.commentIndex || this.commentIndex == 1) {
                        this.listComment = res.body.body.items
                        this.Initnum = res.body.body.items.length
                    } else {
                        for (let i = 0; i < res.body.body.items.length; i++) {
                            for (let r = 0; r < this.listComment.length; r++) {
                                if (res.body.body.items[i].id == this.listComment[r].id) {
                                    return;
                                }
                            }
                            this.listComment.push(res.body.body.items[i])
                        }
                    }
                    this.num = res.body.body.items.length
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //删除评论
        delComment: function(index, type) {
            if (type == 'del') {
                this.listComment.splice(index, 1)
                this.num--
            }
            this.item.commentCount = parseInt(this.item.commentCount) - 1
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
                if (this.listComment.length == 0 || parseInt(this.listComment.length) % 10 != 0) {
                    this.listComment.push(data)
                }
                this.item.commentCount = parseInt(this.item.commentCount) + 1
                this.num++
                this.$emit('count', 'comment', '', this.item.commentCount)
            } else {
                if (this.listComment[this.replyIndex].subItems.length == 0 || (parseInt(this.listComment[this.replyIndex].subItems.length) - 3) % 10 != 0) {
                    this.listComment[this.replyIndex].subItems.push(data)
                }
                this.listComment[this.replyIndex].subCount = parseInt(this.listComment[this.replyIndex].subCount) + 1
            }
            this.commentHide = false
        },
        Init: function(dataid, type) {
            this.type = type
            this.dataid = dataid
            this.commentIndex = 0
            this.Initnum = 0
            this.cmtid = ''
            this.replyIndex = ''
            this.commentMore(0)
        },

    },
    components: {
        comment,
        commentTextarea
    },


}
</script>
