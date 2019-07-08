<template>
    <div class="dynamic-content">
        <div v-if="item.adv=='0'||item.adv==0" class="site-ess">
            <div class="flex">
                <img src="./img/pro_essence.png" />
                <p>精华</p>
            </div>
            <img class="ess-right" src="./img/adv_right.png" />
        </div>
        <div class="site-pro-top" v-if="!item.dynaImages||item.dynaImages.length<=0||item.dynaImages[0].mediaType=='0'||from=='list'">
            <div class="pro-user-info">
                <img class="pro-avatar-img" @click="toRuleDetail(item.uid,item.roleid,item.merid)" :src="item.avatar||avatarDefault">
                <img v-if="item.proveStatus=='0'" class="huihome-v" src="../../images/zhibo_icon_vip.png">
                <div class="dyna-userInfo">
                    <p>
                        <span class="pro-user-name" @click="toRuleDetail(item.uid,item.roleid,item.merid)">{{item.username }}</span>
                        <span class="pro-user-role">/{{item.userRank }}</span>
                    </p>
                    <p class="pro-user-date">{{getDateDiff(item.occurTime )}}</p>
                </div>
            </div>
            <img class="acceptAnswer" v-if="type=='6'&&accept=='accept'" src="./img/icon_yicaina.png" />
            <div class="pro-follow" v-else-if="type=='1'" @click="follow(item.uid)">
                <img v-if="item.followStatus=='1'||item.followStatus==1" src="../../images/zhibo_btn_guanzhu.png" />
                <img v-else src="../../images/btn_yiguanzhu.png" />
                <p v-if="item.followStatus=='1'||item.followStatus==1">关注</p>
                <p v-else class="c8">已关注</p>
            </div>
            <div v-else-if="type=='6'&&from=='list'&&userId==uid&&acceptStatus=='-1'" class="aid-adopt" @click="adopt(item.id)">
                采纳
            </div>
        </div>
        <div class="pro-dyna-content">
            <p class="pro-dyna-txt" :class="{'pro-hideen':from=='list'&&hideFlag}" v-html="Trim(item.msgtxt)" ref="txt" @click="todynamic(item.id)"></p>
            <p v-if="from=='list'&&hideFlag" class="exchangeButton" @click="toDetail(item.id)">全文</p>

            <div :class="[item.dynaImages.length==1?'img-list length1':'img-list',item.dynaImages.length==4?'length4':'',]" v-if="item.dynaImages&&item.dynaImages.length>0&&item.dynaImages[0].mediaType=='0'">
                <div class="preview-img" v-for="(images,index) in item.dynaImages" :key="index" :style="'background-image: url('+images.listImg+')' " @click="$preview.open(index,imgList)">
                </div>
            </div>
            <div @click="videoTimeShoe=false" :index="index" v-else-if="item.dynaImages&&item.dynaImages.length>0&&item.dynaImages[0].mediaType=='1'&&from=='list'" :id="'J_prismPlayer'+tab+index" class="prism-player">
                <p v-show="videoTimeShoe" class="video-time">{{videoTime(item.dynaImages[0].duration)}}</p>
            </div>
        </div>
        <div class="pro-cell-infor">
            <div class="toProject" v-if="item.show" @click="toProject(item.projid)">
                看工地
            </div>
            <p v-if="item.cellId&&item.cellId4proj&&item.cellId==item.cellId4proj">
                <span class="pro-cell-name">{{item.cellName }}</span>设计和施工
            </p>
            <p v-else-if="item.cellId&&item.cellId4proj&&item.cellId!=item.cellId4proj">
                <span class="pro-cell-name">{{item.cellName }}</span>设计/
                <span class="pro-cell-name">{{item.cellName4proj }}</span>施工
            </p>
            <p v-else-if="item.cellId&&!item.cellId4proj">
                <span class="pro-cell-name">{{item.cellName }}</span>设计
            </p>
            <p v-else-if="!item.cellId&&item.cellId4proj">
                <span class="pro-cell-name">{{item.cellName4proj }}</span>施工
            </p>
        </div>
        <p class="pro-delete" v-if="userId==item.uid&&from=='list'&&type!='6'" @click="proDelissue(item.id)">删除</p>
    </div>
</template>
<script>
import Vue from "vue"
import './dynamicContent.scss'
import utils from '../../../common/utils'
import config from '../../../common/config.class'
import userFollow from '../../../common/userFollow.class'
import detailVideo from '../detailVideo/detailVideo'
import aidAccept from '../../../common/aid/aidAccept.class'
import proDelissue from '../../../common/project/projectDelissue.class'
import video from '../video/video'
import {
    Toast,
    Indicator,
    MessageBox
} from 'mint-ui';

export default {
    props: ['item', 'accept', 'uid', 'acceptStatus', 'type', 'from', 'index', 'tab'],
    data() {
        return {
            avatarDefault: require('../../images/default_head.png'),
            userId: '',
            hideFlag: false,
            imgList: [],
            videoTimeShoe: true,
            player: Object
        }
    },
    created() {
        this.userId = utils.getLoginData('loginUserAuthToken').userId
    },
    methods: {
        videoS: function() {
            console.log(this.player.playing)
            // if(this.player){
            //     this.player.pause();
            // }
        },
        toDetail: function(id) {
            this.$router.push({
                name: 'dynamicDetail',
                query: {
                    dyid: id
                }
            })
        },
        Trim: function(str) {  //str表示要转换的字符串
            return utils.Trim(str)
        },
        getRole: function(roleId) {
            return utils.getRole(roleId);
        },
        videoTime: function(time) {
            return parseInt(parseInt(time) / 60) + ':' + parseInt(time) % 60
        },
        getDateDiff: function(dateTimeStamp) {
            return utils.getDateDiff(dateTimeStamp);
        },
        getLoginData: function() {
            utils.getLoginData('loginUserAuthToken')
        },
        toVideo: function(url) {
            this.$router.push({
                name: 'text',
                query: {
                    url: url
                }
            })
        },
        //删除直播
        proDelissue: function(id) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            MessageBox.confirm('您确定删除这条直播吗?').then(action => {
                let AA = new proDelissue(this)
                let loginUser = utils.getLoginData('loginUserAuthToken');
                let reqParamcom = {
                    uid: loginUser.userId,//loginUser.uid,
                    serialNo: loginUser.serialNo,//loginUser.serialNo,
                    authCode: loginUser.authCode,//loginUser.authCode,
                    dyid: id
                }
                Indicator.open({
                    text: '提交中...',
                });
                AA.request(reqParamcom).then((res) => {
                    Indicator.close();
                    if (res.body.respCode == "00") {
                        utils.vToast(res.body.respMsg, '删除成功')
                        this.$emit('proDel')
                    } else {
                        Indicator.close();
                        Toast(res.body.respMsg)
                    }
                }).catch((e) => {
                    Indicator.close();
                    Toast(e);
                })
            });
        },
        todynamic: function(id) {
            if (this.type == '6' && this.from == 'list') {
                this.$router.push({
                    name: 'aidAnswer',
                    query: {
                        ansid: id
                    }
                })
            } else if (this.from == 'list') {
                this.$router.push({
                    name: 'dynamicDetail',
                    query: {
                        dyid: id
                    }
                })
            }
        },
        //跳转工地详情页面
        toProject: function(id) {
            this.$router.push({
                name: 'projectDetail',
                query: {
                    projid: id,
                }
            })
        },
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid) {
            return utils.toRuleDetail(this, uid, roleid, merid)
        },
        //采纳回答提交接口
        adopt: function(id) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            MessageBox.confirm('您确定采纳这条回答吗?').then(action => {
                let AA = new aidAccept(this)
                let loginUser = utils.getLoginData('loginUserAuthToken');
                let reqParamcom = {
                    uid: loginUser.userId,//loginUser.uid,
                    serialNo: loginUser.serialNo,//loginUser.serialNo,
                    authCode: loginUser.authCode,//loginUser.authCode,
                    answerid: id
                }
                Indicator.open({
                    text: '提交中...',
                });
                AA.request(reqParamcom).then((res) => {
                    Indicator.close();
                    if (res.body.respCode == "00") {
                        this.$emit('adopt', res.body.body)
                    } else {
                        Indicator.close();
                        Toast(res.body.respMsg)
                    }
                }).catch((e) => {
                    Indicator.close();
                    Toast(e);
                })
            });
        },
        follow: function(targetUid) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let UF = new userFollow(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                targetUid: targetUid
            }
            Indicator.open({
                text: '提交中...',
            });
            UF.request(reqParamcom, this.item.followStatus).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.item.followStatus == 0) {
                        utils.vToast(res.body.respMsg, '取消关注成功')
                        this.item.followStatus = '1'
                        this.item.followedCount = parseInt(this.item.followedCount) - 1
                    } else {
                        utils.vToast(res.body.respMsg, '关注成功')
                        this.item.followStatus = '0'
                        this.item.followedCount = parseInt(this.item.followedCount) + 1
                    }
                } else {
                    Indicator.close();
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },

    },
    components: {
        detailVideo
    },
    watch: {
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
        'item.msgtxt': {
            immediate: true,
            handler: function() {
                this.$nextTick(function() {
                    if (!this.$refs.txt) {
                        return;
                    }
                    let rem = parseFloat(document.getElementsByTagName('html')[0].style.fontSize.replace('px', ''))
                    //let height = parseFloat(window.getComputedStyle(this.$refs.txt).height.replace('px', ''))
                    let height = parseFloat(this.$refs.txt.offsetHeight)
                    if (height > rem * 6.6) {
                        this.hideFlag = true
                    }
                })
            }
        },
        'item.dynaImages': {
            immediate: true,
            handler: function(to, from) {
                this.$nextTick(function() {
                    var that = this
                    if (that.item.dynaImages && that.item.dynaImages.length > 0) {
                        if (that.item.dynaImages[0].mediaType == '1' && !from) {
                            let player = new Aliplayer({
                                id: 'J_prismPlayer' + that.tab + that.index,
                                width: '100%',
                                height: '6.62rem',
                                autoplay: false,
                                preload: false,
                                useH5Prism: true,
                                // rePlay: true,
                                source: that.item.dynaImages[0].detailImg,
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
                                cover: that.item.dynaImages[0].listImg
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
                            for (let i = 0; i < this.item.dynaImages.length; i++) {
                                let img_url = this.item.dynaImages[i].detailImg
                                let img = new Image();
                                img.src = img_url;
                                img.onload = function() {
                                    that.imgList[i] = { 'src': that.item.dynaImages[i].detailImg, 'w': img.width, 'h': img.height }
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

