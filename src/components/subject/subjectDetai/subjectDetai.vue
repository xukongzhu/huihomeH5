<template>
    <div class="subject-detail">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <img class="banner" v-if="header.ugcFlag =='1'" :src="header.bannerImg||defaultbanner" />
                <img class="banner" v-else-if="header.ugcFlag =='0'" :src="header.logoImg||defaultbanner" />
                <div class="infor">
                    <div class="top">
                        <p class="title">{{header.name}}</p>
                        <p class="digest" v-html="Trim(header.digest)">
                        </p>
                    </div>
                    <div v-if="header.ugcFlag =='1'">
                        <p class="txt" v-html="Trim(header.detail )"></p>
                        <div :class="[subjectDetail.subjImgList.length==1?'img-list length1':'img-list',subjectDetail.subjImgList.length==4?'length4':'',]" v-if="subjectDetail.subjImgList">
                            <div v-for="(images,index) in subjectDetail.subjImgList" :key="index" :style="'background-image: url('+images.listImg+')' " @click="$preview.open(index,imgList)">
                            </div>
                        </div>
                    </div>
                    <div class="data">
                        <img src="../../images/read.png" />
                        <span>阅读</span>
                        <span>{{header.clickCount}}</span>
                        <img src="../../images/icon_baoming.png" />
                        <span>参与</span>
                        <span>{{header.dynamicCount }}</span>
                    </div>
                </div>
                <div class="dynamic-list">
                    <div class="dynamic-list-title">
                        <div></div>
                        <p>绘友说</p>
                    </div>
                    <div v-if="subjectDetail.dynaItems&&subjectDetail.dynaItems.length>0">
                        <div v-for="(item,index) in subjectDetail.dynaItems " :key="index">
                            <dynamic ref="dynamic" :index="index" :from="'list'" :dataid="item.id" :type="'1'" :item="item"></dynamic>
                        </div>
                    </div>
                    <myNone v-else></myNone>
                </div>
            </mt-loadmore>
        </div>
    </div>
</template>
<script>
import './subjectDetai.scss'
import {
    Toast,
    Indicator
} from 'mint-ui'
import utils from '../../../common/utils'
import config from '../../../common/config.class'
import subjectDetail from '../../../common/subject/subjectDetail.class'
import dynamic from '../../assembly/dynamic/dynamic'
import myNone from '../../my-none/my-none.vue'
import menuTop from '../../assembly/menu/menu-top.vue'
export default {
    data: function() {
        return {
            subjectDetail: Object,
            lastId: '-1',
            pageIndex: 0,
            header: Object,
            defaultbanner: require('./img/huati_bg.png'),
            imgList: []
        }
    },
    activated: function() {
        this.active();
    },
    methods: {
        Trim: function(str) {  //str表示要转换的字符串
            return utils.Trim(str)
        },
        active: function() {
            let SD = new subjectDetail(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            this.pageIndex = this.pageIndex + 1
            let reqParam = {
                uid: loginUser.userId || '-1',
                subId: this.$route.query.subId,
                lastId: this.lastId,
                pageIndex: this.pageIndex,
                pageSize: 10
            }
            Indicator.open({
                text: '加载中...'
            });
            SD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    if (this.pageIndex == 1) {
                        this.subjectDetail = res.body.body
                        this.header = res.body.body.header
                    }
                    let start = res.body.body.dynaItems.length;
                    if (start > 0) {
                        if (this.pageIndex > 1) {
                            for (let i = 0; i < start; i++) {
                                this.subjectDetail.dynaItems.push(res.body.body.dynaItems[i])
                            }
                        }
                        this.lastId = res.body.body.dynaItems[res.body.body.dynaItems.length - 1].id
                    }

                    let shareUrl = ''
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/subjectDetai?subId=' + this.$route.query.subId + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/subjectDetai?subId=' + this.$route.query.subId
                    }
                    utils.publicShare(this, res.body.body, shareUrl)
                } else {
                    Toast(res.body.respMsg)
                }
                if (this.pageIndex > 1) {
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded();
                    }, 500)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        loadTop: function() {
            this.pageIndex = 0
            this.lastId = '-1'
            this.active();
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
        infinite: function() {
            this.active();
        }
    },

    components: {
        dynamic,
        myNone,
        menuTop
    },
    watch: {
        $route(to, from) {
            if (to.name == 'subjectDetai' && from.name == 'subjectDetai') {
                this.active()
                this.pageIndex = 0
                this.lastId = '-1'
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },
        'subjectDetail.subjImgList': {
            immediate: true,
            handler: function() {
                this.$nextTick(function() {
                    var that = this
                    if (this.subjectDetail.subjImgList) {
                        for (let i = 0; i < this.subjectDetail.subjImgList.length; i++) {
                            let img_url = this.subjectDetail.subjImgList[i].detailImg
                            let img = new Image();
                            img.src = img_url;
                            img.onload = function() {
                                that.imgList[i] = { 'src': that.subjectDetail.subjImgList[i].detailImg, 'w': img.width, 'h': img.height }
                            };
                        }
                    }
                })
            },
        },
    }
}
</script>
