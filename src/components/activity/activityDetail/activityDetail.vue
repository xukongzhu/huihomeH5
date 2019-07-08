<template>
  <div class="activity">
    <menuTop v-if="!isLocalEnv" :class="'menuScorll'+$store.state.menutopShow"></menuTop>
    <div @touchstart="common.start($store,$event)" @touchmove="common.move($store,$event)" @scroll="common.scroll($store)" :class="{'p0':isLocalEnv}" class="content">
      <mt-loadmore :top-method="loadTop" ref="loadmore" :auto-fill="false">
        <div class="top">
          <div class="title">{{activityDetail.theme }}</div>
          <div class="data">
            <img src="../../images/read.png" />
            <span>{{activityDetail.clickCount }}</span>
            <img src="../../images/icon_fenxiang.png" />
            <span>{{activityDetail.shareCount }}</span>
          </div>
          <div class="infor">
            <div class="df">
              <img src="../../images/icon_shijian.png" />
              <p>{{format(activityDetail.actStartTime,'yyyy-MM-dd')}} 至 {{format(activityDetail.actEndTime,'yyyy-MM-dd HH:mm')}}</p>
            </div>
            <div class="df">
              <img src="../../images/place.png" />
              <p>{{activityDetail.address}}</p>
            </div>
            <div class="df">
              <img src="../../images/icon_baoming.png" />
              <p>已有{{activityDetail.applyCount }}人报名</p>
            </div>
          </div>
        </div>
        <div class="txt" v-html="Trim(activityDetail.description)">

        </div>
        <div class="activety-comment">
          <div class="activety-comment-title">
            <div></div>
            <p>评论 {{activityDetail.commentCount }}</p>
          </div>
          <commentList ref="commentList" :item="activityDetail"></commentList>

        </div>
        <div class="sign-list">
          <div class="sign-title">
            <div></div>
            <p>成功报名 {{activityDetail.applyCount}}</p>
          </div>
          <div class="sign-div" v-for="(item,index) in activetyApplies " :key="index">
            <div>
              <img :src="item.avatar||avatarDefault" />
              <p class="sign-name">{{item.username}}</p>
            </div>
            <p class="sign-date">{{getDateDiff(item.occurTime)}}</p>
          </div>
          <div class="sign-more" @click="applies()" v-if="activetyApplies.length>=10&&activityDetail.applyCount>activetyApplies.length">
            查看更多报名<img src="../../images/pinglun_btn_gengduo.png" />
          </div>
          <div class="sign-more" @click="applies(0)" v-else-if="activetyApplies.length>=10&&activityDetail.applyCount<=activetyApplies.length">
            收起更多报名<img src="../../images/zhibo_btn_pinglun_right2.png" />
          </div>
        </div>
        <bottomLoad v-if="!isLocalEnv"></bottomLoad>
      </mt-loadmore>
    </div>
    <div class="active-bottom">
      <div @click="appraise(activityDetail.id)">
        <img v-if="appraiseType==0" src="../../images/icon_zan.png" />
        <img v-else-if="appraiseType==1" src="../../images/btn_zan1.png" />
        <p :class="{'c3db8':appraiseType=='1'}">点赞 {{activityDetail.appraiseCount}}</p>
      </div>
      <div @click="commentshow('0')">
        <img src="../../images/icon_pinglun.png" />
        <p>评论 {{activityDetail.commentCount}}</p>
      </div>
      <div v-if="activityDetail.applyStatus=='0'" @click="toSign()">立即报名</div>
      <div class="status" v-else-if="activityDetail.applyStatus=='-1'">报名未开始</div>
      <div class="status" v-else-if="activityDetail.applyStatus=='1'">报名已结束</div>
    </div>
  </div>
</template>
<script>
import {
  Toast,
  Indicator
} from 'mint-ui'
import utils from '../../../common/utils'
import config from '../../../common/config.class'
import bottomLoad from '../../assembly/bottomLoad/bottomLoad'
import commentList from '../../assembly/commentList/commentList'
import activetyApplies from '../../../common/activity/activityApplies.class'
import activityDetail from '../../../common/activity/activityDetail.class'
import appraiseActivity from '../../../common/activity/appraiseActivity.class'
import menuTop from '../../assembly/menu/menu-top'
import './activityDetail.scss'
export default {
  data: function() {
    return {
      avatarDefault: require('../../images/default_head.png'),
      activetyApplies: [],
      appliesIndex: 0,
      activityDetail: Object,
      appraiseType: 0,
      isLocalEnv: false
    }
  },
  created() {
    this.isLocalEnv = utils.isLocalEnv()
  },

  activated: function() {
    this.active();
    this.applies();
  },
  methods: {
    Trim: function(str) {  //str表示要转换的字符串
      return utils.Trim(str)
    },

    getDateDiff: function(dateTimeStamp) {
      return utils.getDateDiff(dateTimeStamp);
    },
    format: function(time, format) {
      return utils.format(time, format)
    },
    active: function() {
      let AD = new activityDetail(this)
      let loginUser = utils.getLoginData('loginUserAuthToken');
      let reqParam = {
        uid: loginUser.userId || '',
        serialNo: loginUser.serialNo || '',
        authCode: loginUser.authCode || '',
        activityid: this.$route.query.activityid,
      }
      Indicator.open({
        text: '加载中...'
      });
      AD.request(reqParam).then((res) => {
        Indicator.close();
        if (res.body.respCode == "00") {
          this.appraiseType = parseInt(res.body.body.appraised)
          this.activityDetail = res.body.body
          this.$refs.commentList.Init(this.activityDetail.id, '5');
          let shareUrl = ''
          if (!utils.isLocalEnv()) {
            shareUrl = config.SERVERADD() + '/huihomeH5/#/activityDetail?activityid=' + this.$route.query.activityid + '&shareUid=' + utils.getUrlParam('shareUid')
          } else {
            shareUrl = config.SERVERADD() + '/huihomeH5/#/activityDetail?activityid=' + this.$route.query.activityid
          }
          utils.publicShare(this, res.body.body, shareUrl, '详情')
        } else {
          Toast(res.body.respMsg)
        }
      }).catch((e) => {
        Indicator.close();
        Toast(e);
      })
    },
    applies: function(appliesIndex) {
      let AA = new activetyApplies(this)
      let loginUser = utils.getLoginData('loginUserAuthToken');
      if (appliesIndex || appliesIndex == 0) {
        this.appliesIndex = appliesIndex
      }
      this.appliesIndex = this.appliesIndex + 1
      let reqParam = {
        activityid: this.$route.query.activityid,
        pageSize: '10',
        pageIndex: this.appliesIndex
      }
      Indicator.open({
        text: '加载中...'
      });
      AA.request(reqParam).then((res) => {
        Indicator.close();
        if (res.body.respCode == "00") {
          let start = res.body.body.length;
          if (this.appliesIndex > 1) {
            if (start > 0) {
              for (let i = 0; i < start; i++) {
                this.activetyApplies.push(res.body.body[i])
              }
            }
          } else {
            this.activetyApplies = res.body.body
          }
        } else {
          Toast(res.body.respMsg)
        }
      }).catch((e) => {
        Indicator.close();
        Toast(e);
      })
    },
    appraise: function(id) {
      if (!utils.getLoginData('loginUserAuthToken').userId || utils.getLoginData('loginUserAuthToken').userId < 0) {
        utils.checkLogin()
        return
      }
      let AA = new appraiseActivity(this)
      let loginUser = utils.getLoginData('loginUserAuthToken');
      let reqParamcom = {
        uid: loginUser.userId,//loginUser.uid,
        serialNo: loginUser.serialNo,//loginUser.serialNo,
        authCode: loginUser.authCode,//loginUser.authCode,
        activityid: id
      }
      Indicator.open({
        text: '提交中...',
      });
      AA.request(reqParamcom, this.appraiseType).then((res) => {
        Indicator.close();
        if (res.body.respCode == "00") {
          if (this.appraiseType == 0) {
            utils.vToast(res.body.respMsg, '点赞成功')
            this.appraiseType = 1
            this.activityDetail.appraiseCount = parseInt(this.activityDetail.appraiseCount) + 1
          } else {
            utils.vToast(res.body.respMsg, '取消点赞成功')
            this.appraiseType = 0
            this.activityDetail.appraiseCount = parseInt(this.activityDetail.appraiseCount) - 1
          }
        } else {
          Toast(res.body.respMsg)
        }
      }).catch((e) => {
        Indicator.close();
        Toast(e);
      })
    },
    toSign: function() {
      //utils.checkLogin()
      this.$router.push({
        name: 'activitySign',
        query: {
          activityid: this.activityDetail.id,
          mobile: this.activityDetail.mobile,
          village: this.activityDetail.village,
          username: this.activityDetail.username,
          shareUid: utils.getUrlParam('shareUid') || '-1'
        }
      })
    },
    loadTop: function() {
      this.appliesIndex = 0;
      this.active();
      this.applies();
      setTimeout(() => {
        this.$refs.loadmore.onTopLoaded();
      }, 500)
    },
    //输入框显示事件
    commentshow: function(cmtid) {
      this.$refs.commentList.commentshow(cmtid, 'com')
    },
  },
  components: {
    menuTop,
    commentList,
    bottomLoad
  },
  watch: {
    $route(to, from) {
      if ((to.name == 'activityDetail' && from.name == 'activityDetail') || (to.name == 'activityDetail' && from.name == 'activitySign')) {
        this.appliesIndex = 0;
        this.active();
        this.applies(0);
        document.getElementsByClassName('content')[0].scrollTop = 0
      }
    },
  }
}
</script>
