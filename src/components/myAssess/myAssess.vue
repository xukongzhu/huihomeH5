<template>
  <div class="myAssess">
    <div class="content">
      <ul class="ass-type-list">
        <li class="select-list" @click="typeClick('-1',$event)">全部</li>
        <li @click="typeClick('1',$event)">设计师</li>
        <li @click="typeClick('2',$event)">工长</li>
        <li @click="typeClick('5',$event)">客服</li>
        <li @click="typeClick('6',$event)">监理</li>
        <li @click="typeClick('7',$event)">商家</li>
      </ul>
      <div>
        <div v-if="assessList.dynaItems&&assessList.dynaItems.length">
          <div v-for="(item,index) in assessList.dynaItems" :key="index">
            <assesses :from="'list'" :my="'my'" :index="index" :extradata="JSON.parse(item.extradata)" :item="item"></assesses>
            <!--<ruleAss :ruleAss="item">
                    </ruleAss>-->
            <!--<shopAss v-else :shopAss="item">
                      </shopAss>-->
          </div>
        </div>
        <myNone v-else></myNone>
      </div>

    </div>
  </div>
</template>
<script>
import './myAssess.scss'
import myNone from '../my-none/my-none'
import {
  Toast
} from 'mint-ui'
import assesses from '../assembly/assesses/assesses'
import utils from '../../common/utils'
import assessList from '../../common/owner/ownerAssess.class'
export default {
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      assessList: new assessList().defaultData,
      AS: new assessList(this, 'assessList'),
      uid: this.getUrlParam('uid'),
      ownerid: this.getUrlParam('uid')
    }
  },
  activated: function() {
    this.typeList('-1')
    let shareUrl = ''
    let Share = {
      shareUrl: shareUrl,
      shareTitle: '',
      shareDigest: '',
      shareImage: '',
      pageTitle: '我的评价',
    }
    if (!utils.isLocalEnv()) {

    } else {
      utils.APPshare(Share)
    }
  },
  methods: {
    getUrlParam: function(name) {
      return utils.getUrlParam(name)
    },
    typeClick: function(targetRoleid, event) {
      console.log(event)
      var obj = event.currentTarget
      if (obj.classList == 'select-list') {
        return
      }
      document.getElementsByClassName('select-list')[0].classList.remove('select-list');
      obj.classList.add('select-list')
      this.typeList(targetRoleid)
    },
    typeList: function(targetRoleid) {
      let reqParam = {
        ownerid: utils.getUrlParam('uid'),
        uid: utils.getUrlParam('uid'),
        targetRoleid: targetRoleid,
        pageIndex: '1',
        pageSize: '100',
        asc: ''
      }
      this.AS.request(reqParam).then((res) => {
        if (res.body.respCode != "00") {
          Toast(res.body.respMSG)
          return
        }
        this.assessList = res.body.body
      }, (err) => {
        throw err
      })
    }
  },
  components: {
    myNone,
    assesses
  }
}
</script>