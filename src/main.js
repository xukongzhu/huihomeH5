// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue"
import Vuex from "vuex"
import VueRouter from "vue-router"
import VueResource from "vue-resource"
import App from './App'
import router from './router'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import echarts from 'echarts'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import textPlaceholder from './common/homeTextPlaceholder.class'
import VuePreview from 'vue2-preview'
Vue.use(VuePreview)
Vue.prototype.$echarts = echarts

Vue.use(Mint);
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.http.options.emulateJSON = true
Vue.config.productionTip = false

import utils from './common/utils'
/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    menutopShow: 'bottom',
    textPlaceholder1: '快来说点什么吧',
    menutopHide: false
  },
  mutations: {
    updateMenutopShow: (state, data) => {
      state.share = data
    },
  }
})
import _common from './common/common'
Vue.prototype.common = _common
const vm = new Vue({
  el: '#app',
  router,
  store,
  components: {
    App,
  },
  data() {
    return {
      menutopShow: 'bottom',
    }
  },
  template: '<App/>',
  created() {
    //初始化输入框占位符
    let CI = new textPlaceholder(this)
    let reqParamcom = {
      usefor: '1'
    }
    CI.request(reqParamcom).then((res) => {
      this.$store.state.textPlaceholder1 = res.body.body
    }).catch((e) => {

    })
  },
  mounted: function mounted() {
    //原生环境执行
    if (utils.isLocalEnv()) {
      //APP登陆回调
      window['hybridAppInit'] = (appInfo) => {
        var infoObj = JSON.parse(appInfo);
        if (infoObj.uid > 0) {
          this.$router.push({
            name: this.$route.name,
            query: {
              activityid: this.$route.query.activityid,
              uid: infoObj.uid,
              serialNo: infoObj.serialNo,
              authCode: infoObj.authCode
            }
          })
        }
      }
    }
  },
  watch: {
    $route(to, from) {
      this.$store.state.menutopShow = 'bottom'
    }
  }
})
