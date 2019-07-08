<template>
    <div class="aid-top">
        <div class="site-pro-top" v-if="!item.dynaImages||item.dynaImages.length<=0||item.dynaImages[0].mediaType=='0'||from=='list'">
            <div class="pro-user-info">
                <img class="pro-avatar-img" @click="toRuleDetail(item.uid,item.roleid,item.merid,item.projid)" :src="item.avatar||avatarDefault">
                <img v-if="item.proveStatus=='0'" class="huihome-v" src="../../images/zhibo_icon_vip.png">
                <div class="dyna-userInfo">
                    <p>
                        <span class="pro-user-name" @click="toRuleDetail(item.uid,item.roleid,item.merid,item.projid)">{{item.username }}</span>
                        <span class="pro-user-role">/{{item.userRank }}</span>
                    </p>
                    <p class="pro-user-date">{{getDateDiff(item.occurTime )}}</p>
                </div>
            </div>
            <div class="pro-follow" @click="aidFollow(item.dataid)">
                <img v-if="item.followStatus=='1'||item.followStatus==1" src="./img/zhibo_btn_guanzhuqiuzhu.png" />
                <img v-else src="./img/zhibo_btn_yiguanzhuqiuzhu.png" />
            </div>
        </div>
        <div class="pro-dyna-content">
            <p class="reward-amount">求助/悬赏绘米{{extradata.point}}</p>
            <p class="pro-dyna-txt" ref="txt" :class="{'pro-hideen':from=='list'&&hideFlag}" v-html="Trim(item.msgtxt)" @click="toAid(item.dataid)"></p>
            <p v-if="from=='list'&&hideFlag" @click="toDetail(item.dataid)" class="exchangeButton">全文</p>
            <div :class="[item.dynaImages.length==1?'img-list length1':'img-list',item.dynaImages.length==4?'length4':'',]" v-if="item.dynaImages&&item.dynaImages.length>0&&item.dynaImages[0].mediaType=='0'">
                <div class="preview-img" v-for="(images,index) in item.dynaImages" :key="index" :style="'background-image: url('+images.listImg+')' " @click="$preview.open(index,imgList)">
                </div>
            </div>
            <div @click="videoTimeShoe=false" :index="index" v-else-if="item.dynaImages&&item.dynaImages.length>0&&item.dynaImages[0].mediaType=='1'&&from=='list'" :id="'J_prismPlayer'+tab+index" class="prism-player">
                <p v-show="videoTimeShoe" class="video-time">{{videoTime(item.dynaImages[0].duration)}}</p>
            </div>
            <div class="aid-data">
                <div>回答
                    <span>{{extradata.ansCount}}</span>
                </div>
                <div>已帮助
                    <span>{{extradata.helpCount}}</span>
                </div>
            </div>
        </div>
        <div class="reward-data" v-if="extradata.acceptStatus=='-1'">
            <p>{{timeDisparity(extradata.endTime)}}</p>
            <div v-if="from=='list'&&extradata.aidStatus=='0'" @click="toAid(item.dataid)">
                回答<img src="../assesses/img/btn_right.png" />
            </div>
            <div v-else-if="from=='list'&&extradata.aidStatus=='-1'" @click="toAid(item.dataid)">
                查看详情<img src="../assesses/img/btn_right.png" />
            </div>
        </div>
        <div class="reward-data" v-else-if="extradata.acceptStatus=='0'">
            <p>已采纳答案</p>
            <div v-if="from=='list'" @click="toAid(item.dataid)">
                查看详情<img src="../assesses/img/btn_right.png" />
            </div>
        </div>
    </div>
</template>
<script>
import './aidTop.scss'
import {
    Toast,
    Indicator,
} from 'mint-ui';
import utils from '../../../common/utils'
import followAid from '../../../common/userFollowAid.class'
export default {
    props: ['item', 'awardPoint', 'expireTime', 'acceptStatus', 'extradata', 'from', 'index', 'tab'],
    data() {
        return {
            avatarDefault: require('../../images/default_head.png'),
            hideFlag: false,
            imgList: [],
            videoTimeShoe: true,
            player: Object
        }
    },
    methods: {
        toDetail: function(id) {
            this.$router.push({
                name: 'aidDetail',
                query: {
                    aid: id,
                }
            })
        },
        videoTime: function(time) {
            return parseInt(parseInt(time) / 60) + ':' + parseInt(time) % 60
        },
        Trim: function(str) {  //str表示要转换的字符串
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
        timeDisparity: function(time) {
            return utils.timeDisparity(time);
        },
        //跳转角色详情页面
        toRuleDetail: function(uid, roleid, merid) {
            return utils.toRuleDetail(this, uid, roleid, merid)
        },
        toAid: function(id) {
            if (this.from == 'list') {
                this.$router.push({
                    name: 'aidDetail',
                    query: {
                        aid: id
                    }
                })
            }
        },
        //关注求助
        aidFollow: function(aid) {
            if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
                utils.checkLogin()
                return
            }
            let FA = new followAid(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParamcom = {
                uid: loginUser.userId,//loginUser.uid,
                serialNo: loginUser.serialNo,//loginUser.serialNo,
                authCode: loginUser.authCode,//loginUser.authCode,
                aid: aid
            }
            Indicator.open({
                text: '提交中...',
            });
            FA.request(reqParamcom, this.item.followStatus).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.item.followStatus == 1) {
                        utils.vToast(res.body.respMsg, '关注成功')
                        this.item.followStatus = '0';
                    } else {
                        utils.vToast(res.body.respMsg, '取消关注成功')
                        this.item.followStatus = '1';
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
