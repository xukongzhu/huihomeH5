<template>
    <div class="comment">
        <img v-if="comment.fromAvatar==''||comment.fromAvatar==null||comment.fromAvatar=='null'" class="comment-avatar" src="../../images/morentouxiang.png" />
        <img v-else class="comment-avatar" :src="comment.fromAvatar" />
        <div class="comment-user-infor">
            <p class="username">{{comment.fromUsername}}/{{getRole(comment.fromRoleid)}}</p>
            <p class="userdata">{{getDateDiff(comment.occurTime) }}</p>
            <p class="comment-txt" v-html="Trim(comment.msgtxt)"></p>
            <div v-if="comment.comments!=''" class="comment-reply">
                <div class="case-sanjiao"></div>
                <div v-for="(item,index) in comment.comments" :key="index" class="reply-infor" v-show="replyShow(index)">
                    <div class="reply-userinfor">
                        <img v-if="item.fromAvatar==''||item.fromAvatar==null||item.fromAvatar=='null'" class="reply-avatar" src="../../images/morentouxiang.png" />
                        <img v-else class="reply-avatar" :src="item.fromAvatar " />
                        <div>
                            <p class="reply-username">{{item.fromUsername }}/{{getRole(item.fromRoleid)}}</p>
                            <p class="reply-data">{{item.occurTime}}</p>
                        </div>
                    </div>
                    <p class="reply-txt">
                        <span v-if="item.toUid!=''&&item.toUid!=null">回复
                            <span class="toUsername">{{item.toUsername}}/{{getRole(item.toRoleid)}}</span>：</span>
                        <span v-if="item.msgtxt" v-html="Trim(item.msgtxt)"></span>
                    </p>
                </div>
                <div @click="replyMore()" v-if="comment.comments&&comment.comments.length>3&&more" class="reply-more">查看更多回复<img src="../../images/btn_zhankai.png" /></div>
                <div @click="replyMore()" v-if="comment.comments&&comment.comments.length>3&&!more" class="reply-more">收起更多回复<img src="../../images/btn_shouqi.png" /></div>
            </div>
        </div>
    </div>
</template>
<script>
import './comment.scss'
import utils from '../../../common/utils'
export default {
    name: 'comment',
    props: ['comment'],
    data() {
        return {
            replyHide: false,
            more: true

        }
    },
    activated: function() {


    },
    methods: {
        Trim: function(str) {  //str表示要转换的字符串
            return utils.Trim(str)
        },
        getRole: function(roleId) {
            return utils.getRole(roleId);
        },
        getDateDiff: function(data) {
            return utils.getDateDiff(data);
        },
        replyShow: function(index) {
            if (index <= 2) {
                return true
            } else {
                return this.replyHide
            }
        },
        replyMore: function() {
            if (this.more) {
                this.replyHide = true
                this.more = false
            } else {
                this.replyHide = false
                this.more = true
            }
        }
    },

}
</script>