<template>
    <div class="assesses">
        <div class="top-user-infor">
            <img @click="toRuleDetail(item.uid,'0',item.merid)" :src="item.avatar||avatarDefault" />
            <div>
                <p @click="toRuleDetail(item.uid,'0',item.merid)">{{item.username}}</p>
                <p>{{extradata.assessDate}}发起了评价</p>
            </div>
        </div>
        <div class="ass-div">
            <div class="title" v-if="selected!='1'">
                <div></div>
                <p>评价对象</p>
            </div>
            <div v-if="extradata.targetUser && selected!='1'" class="ruleAss-rule-infor" @click="toRuleDetail(extradata.targetUser.uid,extradata.targetUser.roleId,extradata.targetUser.merid)">
                <img :src="extradata.targetUser.avatar">
                <div>
                    <p>{{extradata.targetUser.username}}/
                        <span>{{extradata.targetUser.userRank}}</span>
                    </p>
                    <p>{{extradata.targetUser.slogan}}</p>
                </div>
            </div>
            <div class="shopAss-infor" v-else-if="extradata.merItem">
                <img :src="extradata.merItem.merlogo" />
                <div class="shopAss-infor-a">
                    <div style="width:60%;">
                        <p class="shopAss-mer-title">{{extradata.merItem.mername }}</p>
                        <p class="shopAss-mer-txt">主营：{{extradata.merItem.goods}}</p>
                        <div class="shopASS-ga">
                            <div v-if="item.grade" class="grade">金牌商家</div>
                            <div v-if="item.assure" class="assure">保</div>
                        </div>
                    </div>
                    <img class="shopAss-toShop" @click="toRuleDetail('','7',extradata.merItem.merid)" src="./img/zhibo_btn_jindian.png" />
                </div>
            </div>
        </div>
        <div class="ass-div">
            <div class="title">
                <div></div>
                <p>评价得分</p>
                <button class="phase" v-if="extradata.phase">
                    {{item.phase||extradata.phase }}阶段
                </button>
            </div>
            <div class="ass-infor" v-if="extradata.assessType =='2'">
                <div class="ass-c">
                    <p>专业水平</p>
                    <stars :starsObj="{score:extradata.scoreProf,maxScore:5}"></stars>
                    <span>{{parseFloat(extradata.scoreProf).toFixed(1)}}</span>
                </div>
                <div class="ass-c">
                    <p>服务态度</p>
                    <stars :starsObj="{score:extradata.scoreManner,maxScore:5}"></stars>
                    <span>{{parseFloat(extradata.scoreManner).toFixed(1)}}</span>
                </div>
                <div class="ass-c">
                    <p>直播互动</p>
                    <stars :starsObj="{score:extradata.scoreActive,maxScore:5}"></stars>
                    <span>{{parseFloat(extradata.scoreActive).toFixed(1)}}</span>
                </div>
            </div>
            <div class="ass-infor" v-else>
                <div class="ass-c">
                    <p>服务态度</p>
                    <stars :starsObj="{score:extradata.scoreManner ,maxScore:5}"></stars>
                    <span>{{parseFloat(extradata.scoreManner ).toFixed(1)}}</span>
                </div>
                <div class="ass-c">
                    <p>商品质量</p>
                    <stars :starsObj="{score:extradata.scoreProf,maxScore:5}"></stars>
                    <span>{{parseFloat(extradata.scoreProf).toFixed(1)}}</span>
                </div>
                <div class="ass-c">
                    <p>描述相同</p>
                    <stars :starsObj="{score:extradata.scoreActive,maxScore:5}"></stars>
                    <span>{{parseFloat(extradata.scoreActive).toFixed(1)}}</span>
                </div>
            </div>
        </div>
        <div class="ass-div">
            <div class="title">
                <div></div>
                <p>评价详情</p>
            </div>
            <p class="ruleAss-txt" ref="txt" @click="toDetail(extradata.id,extradata.assessType )" :class="{'pro-hideen':from=='list'&&hideFlag}" v-html="Trim(extradata.assessTxt)"></p>
            <p v-if="from=='list'&&hideFlag" @click="toDetail(extradata.id,extradata.assessType )" class="exchangeButton">全文</p>
            <div v-if="extradata.images&&extradata.images.length>0" :class="[extradata.images.length==1?'avatar-list length1':'avatar-list',extradata.images.length==4?'length4':'',]">
                <div v-for="(images,index) in extradata.images" class="preview-img" :key="index" :style="'background-image: url('+images.listImg+')' " @click="$preview.open(index,imgList)">
                </div>
            </div>
            <div v-if="extradata.addAssess" class="chase-ratings">
                <p class="chase-ratings-title">用户追评</p>
                <p class="chase-date">{{extradata.assessDate}}发起了追评</p>
                <div class="evaluate-content" v-html="Trim(extradata.addAssess.assessTxt)"></div>
                <div v-if="item.dynaImages&&item.dynaImages.length>0&&item.dynaImages[0].mediaType=='0'" :class="[extradata.addAssess.images.length==1?'avatar-list length1':'avatar-list',extradata.addAssess.images.length==4?'length4':'',]">
                    <div v-for="(images2,index) in extradata.addAssess.images" :key="index" class="assesses-avatar" :style="'background-image: url('+images2.listImg+')'" @click="$preview($event, extradata.addAssess.images, index,'detailImg')">
                    </div>
                </div>
                <div @click="videoTimeShoe=false" :index="index" v-else-if="item.dynaImages&&item.dynaImages.length>0&&item.dynaImages[0].mediaType=='1'&&from=='list'" :id="'J_prismPlayer'+tab+index" class="prism-player">
                    <p v-show="videoTimeShoe" class="video-time">{{videoTime(item.dynaImages[0].duration)}}</p>
                </div>
            </div>
        </div>
        <div class="ruleAss-operation" v-if="$route.path!='/dynamicDetail'">
            <div class="ruleAss-operation-data">
                <div>
                    <img class="zan" src="./img/btn_pinglunqu_zan.png" /> {{item.appraiseCount }}
                </div>
                <div>
                    <img class="com" src="./img/btn_pinglun.png" /> {{item.commentCount }}
                </div>
            </div>
            <div class="ruleAss-operation-div">
                <div class="reappraisal" v-if="item.assessType=='2'" @click="reappraisal(item.todoId,item.targetUser.roleId)">
                    重新评价<img src="../shopAss/img/aic_btn_right3.png" />
                </div>
                <div v-else-if="!item.addAssess&&(item.isShowAddAssessButton=='1'||item.isShowAddAssessButton==1)" @click="toAddAssesses(item.dataId,ruleAss.merItem.merid,ruleAss.id,ruleAss.dataType)">
                    追加评价<img src="./img/btn_right.png" />
                </div>
                <div @click="toDetail(extradata.id,extradata.assessType )">
                    查看详情<img src="./img/btn_right.png" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import './assesses.scss'
import {
    Toast,
    Indicator
} from 'mint-ui';
import utils from '../../../common/utils'
import comment from '../comment/comment'
import appraiseDynamic from '../../../common/dynamic/appraiseDynamic.class'
import stars from '../stars/stars'
export default {
    props: ['item', 'exhibition', 'listComment', 'extradata', 'from', 'selected', 'tab'],
    data() {
        return {
            avatarDefault: require('../../images/default_head.png'),
            comLenght: 10,
            dyId: '',
            cmtid: '',
            commentHide: false,
            replyIndex: 0,
            pageIndex: 1,
            imgList: [],
            moreShow: false,
            hideFlag: false,
            player: Object

        }
    },
    methods: {
        Trim: function(str) {  //str表示要转换的字符串
            console.log(this.extradata)
            return utils.Trim(str)
        },

        commentHides: function() {
            this.commentHide = false;
        },
        getRole: function(roleId) {
            return utils.getRole(roleId);
        },
        getDateDiff: function(dateTimeStamp) {
            return utils.getDateDiff(dateTimeStamp);
        },
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid) {
            return utils.toRuleDetail(this, uid, roleid, merid)
        },
        //回复提交响应事件
        comSend: function(data) {
            if (!this.replyIndex) {
                this.item.comments.unshift(data)
                this.item.commentCount = parseInt(this.item.commentCount) + 1
            } else {
                this.item.comments[this.replyIndex].subItems.unshift(data)
            }
            this.commentHide = false
            this.$emit('count', 'comment', '', this.item.commentCount)
        },
        reappraisal: function(todoId, roleId) {
            window.location.href = 'huihome://page/reAccess?{"todoId":' + todoId + ',"roleId":' + roleId + '}';
        },
        toAddAssesses: function(id, merid, todoId, dataType) {
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.$router.push({
                name: 'addAssesses',
                query: {
                    dataId: id,
                    merid: merid,
                    parentid: todoId,
                    dataType: dataType,
                    uid: loginUser.userId || '',//loginUser.uid,
                    serialNo: loginUser.serialNo || '',//loginUser.serialNo,
                    authCode: loginUser.authCode || '',//loginUser.authCode,
                }
            })
        },
        //评论框弹出事件
        commentshow: function(cmtid, index) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            this.replyIndex = index
            this.cmtid = cmtid
            this.dyId = this.item.id
            this.commentHide = true;
        }, //点赞事件
        appraise: function(dyId) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let AD = new appraiseDynamic(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                dyId: dyId
            }
            Indicator.open({
                text: '提交中...',
            });
            AD.request(reqParamcom, this.item.appraiseStatus).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.item.appraiseStatus == 0) {
                        utils.vToast(res.body.respMsg, '点赞成功')
                    } else {
                        utils.vToast(res.body.respMsg, '取消点赞成功')
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
        },
        toDetail: function(id, type) {
            if (!type) {
                type = '2'
            }

            if (this.from != 'list') {
                return
            }
            if (utils.isLocalEnv()) {
                if (type == '0') {
                    type = '1'
                }
                window.location.href = 'huihome://page/assess?{"assessType":' + type + ',"assessId":' + id + '}';
            } else {
                this.$router.push({
                    name: 'dynamicDetail',
                    query: {
                        assessid: id,
                        assessType: type
                    }
                })
            }
        }
    },
    components: {
        comment,
        stars
    },
    watch: {
        'extradata.assessTxt': {
            immediate: true,
            handler: function() {
                this.$nextTick(function() {
                    if (!this.$refs.txt) {
                        return;
                    }
                    let rem = parseFloat(document.getElementsByTagName('html')[0].style.fontSize.replace('px', ''))
                    let height = parseFloat(this.$refs.txt.offsetHeight)
                    if (height > rem * 6.6) {
                        this.hideFlag = true
                    }
                })
            }

        },
        'player': {
            handler: function(value) {
                // console.log(value.currentTarget)
                var obj = value._el
                var that = this
                document.getElementsByClassName('content')[0].onscroll = function() {
                    if (obj && (obj.getBoundingClientRect().top < -100 || obj.getBoundingClientRect().top > document.body.clientHeight - 100)) {
                        value.pause();
                    }
                }

            }
        },
        'extradata.images': {
            immediate: true,
            handler: function(to, from) {
                this.$nextTick(function() {
                    var that = this
                    if (that.extradata.images && that.extradata.images.length > 0) {
                        if (that.extradata.images[0].mediaType == '1' && !from) {
                            let player = new Aliplayer({
                                id: 'J_prismPlayer' + that.tab + that.index,
                                width: '100%',
                                height: '6.62rem',
                                autoplay: false,
                                preload: false,
                                useH5Prism: true,
                                // rePlay: true,
                                source: that.extradata.images[0].detailImg,
                                //播放方式一：推荐
                                prismType: 2,
                                skinLayout: [{ name: "bigPlayButton", align: "cc" },
                                {
                                    name: "H5Loading", align: "cc"
                                },
                                { name: "errorDisplay", align: "tlabs", x: 0, y: 0 },
                                { name: "infoDisplay" },
                                { name: "tooltip", align: "blabs", x: 0, y: 56 },
                                { name: "thumbnail" },
                                {
                                    name: "controlBar", align: "blabs", x: 0, y: 0,
                                    children: [
                                        { name: "progress", align: "blabs", x: 0, y: 44 },
                                        { name: "playButton", align: "tl", x: 15, y: 12 },
                                        { name: "timeDisplay", align: "tl", x: 10, y: 7 },
                                        { name: "fullScreenButton", align: "tr", x: 10, y: 12 },
                                    ]
                                }
                                ],
                                cover: that.extradata.images[0].listImg
                            }, function(player) {
                                player.on('playing', function() {
                                    that.player = player
                                    console.log(player._el.firstChild)
                                })
                                player.on('ended', function() {
                                    document.webkitCancelFullScreen();
                                })
                            }
                            );
                        } else {
                            for (let i = 0; i < this.extradata.images.length; i++) {
                                let img_url = this.extradata.images[i].detailImg
                                let img = new Image();
                                img.src = img_url;
                                img.onload = function() {
                                    that.imgList[i] = { 'src': that.extradata.images[i].detailImg, 'w': img.width, 'h': img.height }
                                };
                            }
                        }
                    }
                })
            },
        },
    }
}

</script>
