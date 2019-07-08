<template>
    <div class="project-detail">
        <menuTop :class="'menuScorll'+$store.state.menutopShow"></menuTop>
        <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" class="content">
            <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
                <div class="pro-infor">
                    <div class="user-infor">
                        <div class="df">
                            <img src="../../images/morentouxiang.png" />
                            <p>{{projectDetail.ownerName||'待上线'}}/
                                <span>{{projectDetail.userRank}}</span>
                            </p>
                        </div>
                        <div class="pro-follow" v-if="projectDetail.ownerid " @click="follow(projectDetail.ownerid )">
                            <img v-if="projectDetail.followStatus=='1'" src="../../images/zhibo_btn_guanzhu.png" />
                            <img v-else src="../../images/btn_yiguanzhu.png" />
                            <p v-if="projectDetail.followStatus=='1'">关注</p>
                            <p v-else class="c8">已关注</p>
                        </div>
                    </div>
                    <div class="pro-data">
                        <div class="data">
                            <p>{{projectDetail.hotIndex }}</p>
                            <p>热度排名</p>
                        </div>
                        <div class="data">
                            <p>{{projectDetail.commentCount }}</p>
                            <p>评论</p>
                        </div>
                        <div class="data">
                            <p>{{projectDetail.appraiseCount }}</p>
                            <p>赞</p>
                        </div>
                        <div class="data">
                            <p>{{projectDetail.viewCount }}</p>
                            <p>关注</p>
                        </div>
                        <div class="data">
                            <p>{{projectDetail.clickCount }}</p>
                            <p>阅读</p>
                        </div>
                    </div>
                </div>
                <div class="site-team">
                    <div class="infor-title">
                        <div class="title-left"></div>
                        <div class="title-right">服务团队</div>
                    </div>
                    <div class="stie-cell-list">
                        <siteCell v-for="(item,index) in projectDetail.userList" :item="item" :key="index"></siteCell>
                    </div>
                </div>
                <div class="shop-team" v-if="projectDetail.merList&&projectDetail.merList.length>0">
                    <div class="shop-title-div">
                        <div class="infor-title">
                            <div class="title-left"></div>
                            <div class="title-right">服务商家</div>
                        </div>
                        <div v-if="projectDetail.merList.length>=2" @click="toShopList(projectDetail.projid)" class="shop-more">查看更多&gt;&gt;</div>
                    </div>
                    <div class="shop-cell-list">
                        <shopsObj v-for="(item,index) in projectDetail.merList" :item="item" :key="index"></shopsObj>
                    </div>
                </div>
                <div class="site-dyna">
                    <div class="dyna-title-div">
                        <div class="infor-title">
                            <div class="title-left"></div>
                            <div class="title-right">工地直播</div>
                        </div>
                    </div>
                    <div class="site-screen-div">
                        <div class="site-screen">
                            <div v-for="(option,index) in styleList" @click="styleClick(option.name,index)" :key="index" class="site-option" :class="{'select':index==parseInt(styleIndex)+1}">{{option.name}}</div>
                        </div>
                        <div class="site-screen-right" @click="styleShowC()">
                            <img src="../../owner/img/shouye_btn_fenlei.png" />
                        </div>
                    </div>
                    <div class="site-pro-option" v-if="aiteAsc=='0'" @click="siteData()">
                        按时间倒序浏览
                        <img class="site-pro-img" src="../../owner/img/icon_paixu_xia.png">
                    </div>
                    <div class="site-pro-option" v-else @click="siteData()">
                        按时间顺序浏览
                        <img class="site-pro-img" src="../../owner/img/icon_paixu_shang.png">
                    </div>
                    <div v-if="JSON.stringify(projectDetail.dynaItems)!= '[]'" class="site-dynaItems-list">
                        <div v-for="(item,index) in projectDetail.dynaItems" :key="index">
                            <aidTop :from="'list'" v-if="item.datatype=='1'" :extradata="JSON.parse(item.extradata)" :item="item"></aidTop>
                            <assesses :from="'list'" v-else-if="item.datatype=='3'" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
                            <dynamic v-else ref="dynamic" :index="index" :from="'list'" :dataid="item.id" :type="'1'" :item="item"></dynamic>
                        </div>
                    </div>
                    <myNone v-else></myNone>
                </div>
            </mt-loadmore>
        </div>
        <mt-actionsheet :actions="styleList" v-model="styleShow" cancelText="取消">
        </mt-actionsheet>
    </div>
</template>
<script>
import './projectDetail.scss'
import '../../owner/ownerDetail.scss'
import {
    Toast,
    Indicator,
    Actionsheet
} from 'mint-ui';
import utils from '../../../common/utils'
import siteCell from '../../assembly/siteCell/siteCell'
import shopsObj from '../../assembly/shopsObj/shopsObj'
import aidTop from '../../assembly/aidTop/aidTop'
import myNone from '../../my-none/my-none.vue'
import config from '../../../common/config.class'
import dynamic from '../../assembly/dynamic/dynamic'
import assesses from '../../assembly/assesses/assesses.vue'
import stars from '../../assembly/stars/stars'
import menuTop from '../../assembly/menu/menu-top'
import userFollow from '../../../common/userFollow.class'
import projectDetail from '../../../common/project/projectDetail.class'
import projectDetailDynamic from '../../../common/project/projectDetailDynamic.class'
export default {
    data: function() {
        return {
            projectDetail: Object,
            projectDetailDynamic: [],
            styleList: [],
            styleIndex: -1,
            aiteAsc: '0',
            pageIndex: 1,
            projLastId: '-1',
            styleShow: false
        }
    },
    created() {
        let styleName = ['全部', '前期', '设计', '拆改', '水电', '泥工', '木工', '油漆', '完工', '软装', '入住']
        for (let i = 0; i < styleName.length; i++) {
            this.styleList.push({ 'name': styleName[i], 'method': this.styleClick })
        }

    },
    activated: function() {
        this.active(-1);
    },
    methods: {
        format: function(time, str) {
            return utils.format(time, str);
        },
        //跳转服务商家列表
        toShopList: function(id) {
            this.$router.push({
                name: 'shopsList',
                query: {
                    projid: id
                }
            })
        },
        active: function(step) {
            let OD = new projectDetail(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '-1',
                projid: this.$route.query.projid,
                dynaCount: '10',
                step: step
            }
            Indicator.open({
                text: '加载中...'
            });
            OD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.projectDetail = res.body.body
                    let shareUrl = ''
                    this.select = step
                    if (res.body.body.dynaItems.length > 0) {
                        this.projLastId = res.body.body.dynaItems[res.body.body.dynaItems.length - 1].id
                    }
                    if (!utils.isLocalEnv()) {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/projectDetail?projid=' + this.$route.query.projid + '&shareUid=' + utils.getUrlParam('shareUid')
                    } else {
                        shareUrl = config.SERVERADD() + '/huihomeH5/#/projectDetail?projid=' + this.$route.query.projid
                    }
                    utils.publicShare(this, res.body.body, shareUrl)
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        siteDynamic: function() {
            let OP = new projectDetailDynamic(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                uid: loginUser.userId || '',
                projid: this.$route.query.projid,
                step: this.styleIndex,
                asc: this.aiteAsc,
                lastId: this.projLastId,
                pageIndex: this.pageIndex,
                pageSize: '10'
            }
            Indicator.open({
                text: '加载中...'
            });
            OP.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    let start = res.body.body.dynaItems.length;
                    if (this.pageIndex > 2) {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.projectDetail.dynaItems.push(res.body.body.dynaItems[i])
                            }
                        }
                    } else {
                        this.projectDetail.dynaItems = res.body.body.dynaItems
                    }
                    if (start > 0) {
                        this.projLastId = res.body.body.dynaItems[res.body.body.dynaItems.length - 1].id
                    }
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
            UF.request(reqParamcom, this.projectDetail.followStatus).then((res) => {
                console.log(res.body.respMsg);
                if (res.body.respCode == "00") {
                    if (this.projectDetail.followStatus == 0) {
                        utils.vToast(res.body.respMsg, '取消关注成功')
                        this.projectDetail.followStatus = '1'
                        this.projectDetail.followedCount = parseInt(this.projectDetail.followedCount) - 1
                    } else {
                        utils.vToast(res.body.respMsg, '关注成功')
                        this.projectDetail.followStatus = '0'
                        this.projectDetail.followedCount = parseInt(this.projectDetail.followedCount) + 1
                    }
                } else {
                    Toast(res.body.respMsg)
                }
            }).catch((e) => {
                Toast(e);
            })

        },
        //筛选阶段显示
        styleShowC: function() {
            this.styleShow = true;
        },
        //工地TAB时间顺序切换
        siteData: function() {
            if (this.aiteAsc == '0') {
                this.aiteAsc = '1'
            } else {
                this.aiteAsc = '0'
            }
            this.pageIndex = 1
            this.projLastId = '-1'
            this.siteDynamic()
        },
        styleClick: function(name, index) {
            this.styleIndex = (index - 1)
            this.pageIndex = 1
            this.projLastId = '-1'
            this.siteDynamic()
        },
        //加载更多
        infinite: function() {
            this.siteDynamic()
        },
        //刷新页面
        loadTop: function() {
            this.pageIndex = 1
            this.projLastId = '-1'
            this.styleIndex = -1
            this.aiteAsc = '0'
            this.active(-1);
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
    },
    components: {
        menuTop,
        stars,
        dynamic,
        siteCell,
        shopsObj,
        myNone,
        aidTop,
        assesses
    },
    watch: {
        $route(to, from) {
            if (to.name == 'projectDetail' && from.name == 'projectDetail') {
                this.pageIndex = 1
                this.projLastId = '-1'
                this.styleIndex = -1
                this.aiteAsc = '0'
                this.active(-1);
                document.getElementsByClassName('content')[0].scrollTop = 0
            }
        },
    }
}
</script>
