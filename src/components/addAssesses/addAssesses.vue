<template>
  <div class="ADDassesses">
    <textarea class="com-textarea" v-model="textareaContent" placeholder="快来说点什么吧"></textarea>
    <div id="imgUpload" class="img-upload">
      <div class="pre-view-img" v-for="(item,idx) in imgList" v-if="item!=''" :key="item" :style="'background-image:url('+item+');'" @click="removeItem(idx)" alt="">
      </div>

      <div v-show="imgList.length<maxCount" :key="'btn'" :class="imgList.length>=maxCount?'select-img end-position':'select-img'" @click="uploadEvent">
      </div>
    </div>
    <div class="commit" @click="commit()">
      确认提交
    </div>
    <!--<div v-if="maskControl" class="confirmMask">
                      <div class="content">
                        <p class="tip">为了保证评价的真实可靠，您的评价已提交后台审核，审核通过后将在评论区显示</p>
                        <div class="confirmBtn" @click="togoTop()">
                          知道了
                        </div>
                      </div>
                    </div>-->
  </div>
</template>
<script>
import './addAssesses.scss'
import {
  Toast
} from 'mint-ui'
import utils from '../../common/utils'
import addAssesses from '../../common/owner/addAssesses.class'
export default {
  name: 'addAssesses',
  props: [],
  data() {
    return {
      textareaContent: '',
      imgList: [],
      maxCount: 9,
      addAssesses: Object
    }
  },
  mounted: function() {
    //暴露方法给原生调用
    window.mall_evaluate_imgupload = this.imgListUpdate

  },
  methods: {

    commit: function() {
      if (this.textareaContent == '' || this.textareaContent == null || this.textareaContent == 'null') {
        Toast('请输入评价内容')
        return;
      }
      let AS = new addAssesses(this)
      let loginUser = utils.getLoginData('loginUserAuthToken');
      let param = {
        merid: this.$route.query.merid,
        assessType: '1',
        uid: utils.getUrlParam('uid'),//loginUser.uid,
        serialNo: utils.getUrlParam('serialNo') || '',//loginUser.serialNo,
        authCode: utils.getUrlParam('authCode') || '',//loginUser.authCode,
        msgtxt: this.textareaContent,
        parentid: this.$route.query.parentid,
        dataType: this.$route.query.dataType,
        dataId: this.$route.query.dataId,
        imgUrl: this.imgList.toString()
      };
      AS.request(param).then((res) => {
        console.log(res.body);
        if (res.body.respCode == "00") {
          Toast('追加评价成功')
          history.go(-1)
        } else {
          Toast(res.body.respMsg)
        }
      }).catch((e) => {
        Toast(e);
      })
    },
    imgListUpdate: function(url) {
      let arrr = url.split(',');
      for (let i = 0; i < arrr.length; i++) {
        if (this.imgList.length >= this.maxCount) {
          return
        }
        this.imgList.push(arrr[i])
      }
    },
    iSeeBtnEvent: function() {
      this.maskControl = false
    },
    getRole: function(roleId) {
      return utils.getRole(roleId);
    },
    uploadEvent: function(imgUrl) {
      if (this.imgList.length >= this.maxCount) {
        return
      }
      let u = navigator.userAgent;
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        window.myObj.GetPictureUrlFromAPP('mall_evaluate_imgupload', 9 - this.imgList.length)
      } else if (isiOS) {
        window.GetPictureUrlFromAPP('mall_evaluate_imgupload', 9 - this.imgList.length)
      }
    },
    removeItem: function(index) {
      this.imgList.splice(index, 1)
    }
  },
  components: {
    Toast
  },

}
</script>