import WXshareapply from './WXshareapply.class'
import userShareWeb from './userShareWeb.class'
import wx from 'weixin-js-sdk'
import config from './config.class'
import avtiveInit from './activityInit.class'
import userFollow from './userFollow.class'
import textPlaceholder from './homeTextPlaceholder.class'
import Vue from "vue"
import {
  Toast
} from 'mint-ui'

export default {

  remCalc(designImgWidth) {
    let maxWidthRem = (window.screen.width / designImgWidth * 100)
    let UA = navigator.userAgent
    //安卓机对window.screen计算异常的hack
    if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) {
      maxWidthRem = (document.body.clientWidth / designImgWidth * 100)
    }
    document.querySelector('html').style.fontSize = maxWidthRem + 'px'
    //rem计算二次处理
    let testEl = document.createElement('div')
    let appEl = document.getElementById('app')
    testEl.classList.add('test-el')
    testEl.style.width = designImgWidth / 100 + "rem"
    testEl.style.height = "0"
    try {
      appEl.append(testEl)
    } catch (e) {
      console.warn(e)
      appEl.appendChild(testEl)
    }
    if (testEl.scrollWidth == document.body.clientWidth) {
      //rem计算正确
      testEl.remove()
      return
    }
    //rem计算有误
    let htmlEl = document.querySelector('html')
    let htmlElFz = parseFloat(htmlEl.style.fontSize.replace('px', ''))
    let fixedFz = htmlElFz / (testEl.scrollWidth / document.body.clientWidth)
    htmlEl.style.fontSize = fixedFz + 'px'
    testEl.remove()
  },
  //跳转角色详情页面
  toRuleDetail: function (self, uid, roleid, merid, projid) {
    if ((uid == '' || uid == null || uid == 'null') && (merid == '' || merid == null || merid == 'null')) {
      Toast('该' + this.getRole(roleid) + '暂未加入进来')
      return;
    }
    if (this.isLocalEnv()) {
      if (roleid == 7 || roleid == '7') {
        window.location.href = config.MALL() + '/#/shop-detail/' + merid;
      } else {
        window.location.href = 'huihome://page/user?{"uid":' + uid + ',"roleid":' + roleid + '}';
      }
    } else {
      if (roleid == 1 || roleid == '1') {
        self.$router.push({
          name: 'designerDetail',
          query: {
            designerid: uid
          }
        })
      } else if (roleid == 2 || roleid == '2') {
        self.$router.push({
          name: 'pmDetail',
          query: {
            pmid: uid
          }
        })
      } else if (roleid == 5 || roleid == '5') {
        self.$router.push({
          name: 'serviceDetail',
          query: {
            serviceid: uid
          }
        })
      } else if (roleid == 0 || roleid == '0') {
        self.$router.push({
          name: 'ownerDetail',
          query: {
            ownerid: uid
          }
        })
      } else if (roleid == 6 || roleid == '6') {
        self.$router.push({
          name: 'supervisorDetail',
          query: {
            supervisorid: uid
          }
        })
      } else if (roleid == 7 || roleid == '7') {
        window.location.href = config.MALL() + '/#/shop-detail/' + merid;
      }
    }
  },
  //替换为换行符
  Trim: function (str) {
    if (str) {
      return str.replace(/\n|\r\n/g, "<br/>");
    } else {
      return ''
    }
  },
  //时间差转换
  getDateDiff(dateTimeStamp) {
    let minute = 1000 * 60
    let hour = minute * 60
    let day = hour * 24
    let halfamonth = day * 15
    let month = day * 30
    let now = new Date().getTime()
    let diffValue = now - dateTimeStamp
    if (diffValue < 0) {
      //若日期不符则弹出窗口告之
      //alert("结束日期不能小于开始日期！");
    }
    let result = '';
    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;
    if (monthC >= 1) {
      result = this.format(dateTimeStamp, "yyyy-MM-dd HH:mm")
    } else if (weekC >= 1) {
      result = this.format(dateTimeStamp, "yyyy-MM-dd HH:mm")
    } else if (dayC >= 1) {
      result = this.format(dateTimeStamp, "yyyy-MM-dd HH:mm")
    } else if (hourC >= 1) {
      result = parseInt(hourC) + "小时前"
    } else if (minC >= 1) {
      result = parseInt(minC) + "分钟前"
    } else
      result = "刚刚"
    return result
  },
  //计算悬赏结束时间
  timeDisparity: function (time) {
    var date1 = (new Date()).getTime();
    var date3 = time - date1;
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    var leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))
    if (days < 0 || hours < 0 || minutes < 0) {
      return "悬赏截止时间已过";
    } else {
      return "悬赏结束日期" + days + "天" + hours + "小时" + minutes + "分钟";
    }
  },
  //时间格式化方法
  format(time, format) {
    let t = new Date(time);
    let tf = function (i) {
      return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear())
          break
        case 'MM':
          return tf(t.getMonth() + 1)
          break
        case 'mm':
          return tf(t.getMinutes())
          break
        case 'dd':
          return tf(t.getDate())
          break
        case 'HH':
          return tf(t.getHours())
          break
        case 'ss':
          return tf(t.getSeconds())
          break
      }
    })
  },
  getcellType: function (cellType) {
    switch (cellType) {
      case 1:
        return '设计'
        break;
      case 2:
        return '施工'
        break;
      case 5:
        return '客服'
        break;
      case 6:
        return '监理'
        break;
    }
  },
  //获取不同角色
  getRole: function (roleId) {
    if (roleId == 0) {
      return "业主"
    } else if (roleId == 1) {
      return "设计师"
    } else if (roleId == 2) {
      return "工长"
    } else if (roleId == 4) {
      return "管理"
    } else if (roleId == 5) {
      return "客服"
    } else if (roleId == 6) {
      return "监理"
    } else if (roleId == 7) {
      return "商家"
    } else if (roleId == 8) {
      return "渠道"
    } else {
      return "未知"
    }
  },
  getChestType: function (amtType) {
    if (amtType == 1 || amtType == '1') {
      return '施工券'
    } else {
      return '主材券'
    }
  },

  //获取url
  getUrlParam: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)") || '#';
    console.log(window.location.search.split('?'));
    var url = window.location.hash
    if (window.location.hash.indexOf('?') == -1) {
      url = window.location.search
    }
    var i = '?' + url.split('?')[1];
    var r = i.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  recognizeDevice() {
    return {
      isAndriod: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1
    }
  },
  isLocalEnv() {
    return (window.navigator.userAgent.toLowerCase().indexOf('huidecoration') > -1)
  },
  APPshare: function (share, shareParamaters) {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    //调取后台初始化进入页面接口
    this.avtiveInit(share)
    try {
      if (isiOS) {
        window.SetShareParamatersToAPP(JSON.stringify(shareParamaters))
      } else if (isAndroid) {
        window.myObj.SetShareParamatersToAPP(JSON.stringify(shareParamaters))
        //window.myObj.CallNativeLoginView('hybridAppInit')
      }
    } catch (e) {
      setTimeout(() => {
        this.APPshare(shareParamaters);
      }, 500);
    }
  },
  //进入页面初始化调取后台接口来新增阅读数(可以直接在wxShare方法中调用,传入的obj为当前页面对象)
  avtiveInit: function (obj) {
    let act = new avtiveInit(obj);
    let param = {
      type: '分享点击',
      shareUid: this.getUrlParam('shareUid') || '',
      shareUrl: window.location.href.substr(0, 50),
    }
    act.request(param);
  },
  publicShare: function (obj, share, shareUrl, str) {
    let Share = {
      shareUrl: shareUrl,
      shareTitle: share.shareTitle || share.title,
      shareDigest: share.shareDigest,
      shareImage: share.shareImage || share.shareImg,
      pageTitle: share.shareTitle || share.title,
    }
    if (str != '' && str != null && str != 'null') {
      Share.pageTitle = str
    }
    if (!this.isLocalEnv()) {
      this.wxShare(obj, Share)
    } else {
      this.APPshare(obj, Share)
    }
  },
  //微信分享(调用此方法请把当前页面（this）传入，并且更改全部变量$store.state.share下的三个参数(shareTitle,shareDigest,shareImage))
  wxShare(wxshare, wxShare) {
    let VueInstance = wxshare
    let shareUid = wxshare.$route.query.shareUid || -1
    let url = encodeURIComponent(window.location.href)
    document.title = wxShare.pageTitle
    let meta = document.getElementsByTagName("meta")
    meta[0]['content'] = wxShare.shareDigest
    let desc = wxShare.shareDigest; //$('#shareDigest').val();
    let imgUrl = wxShare.shareImage;; //$('#shareImage').val();
    let title = wxShare.shareTitle; // $('#shareTitle').val();
    const bD = new WXshareapply(wxshare, 'WXshareapply')

    this.avtiveInit(wxshare)

    bD.requestAndSetData({
      url
    }).then((res) => {
      wxshare = res.body.body
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: wxshare.appId, // 必填，公众号的唯一标识
        timestamp: wxshare.timestamp, // 必填，生成签名的时间戳
        nonceStr: wxshare.nonceStr, // 必填，生成签名的随机串
        signature: wxshare.signature, // 必填，签名，见附录1  ticketId 用token去微信取
        jsApiList: [
          'onMenuShareAppMessage',
          'onMenuShareTimeline',
          'onMenuShareQQ',
          'onMenuShareQZone',
          'checkJsApi',
          'openLocation',
          'getLocation'
          //  'hideOptionMenu'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
      wx.ready(function () {
        let link = wxShare.shareUrl;
        //wx.hideOptionMenu();
        wx.onMenuShareAppMessage({ //分享给朋友
          desc: desc,
          link: link,
          title: title,
          imgUrl: imgUrl,
          trigger: function (res) { //获取点击发送朋友事件
          },
          success: function (res) { //获取已分享事件

            // uid，分享者用户ID，整型，未登录为-1, 必选
            // shareMode 分享方式（0=朋友圈，1=微信，2=QQ，3=QQ空间，4=微博）, 必选
            // pageUrl 分享页面url, 必选
            // pageTitle 分享页面标题, 可选
            // datatype 数据类型，定义如下, 可选
            // 0=工地详情,1=工地动态,2=灵感（装修方案）,3=攻略,4=活动,5=团购,6=话题,7=web页面,
            // 8=作品,9=工长详情,10=设计师详情,11客服详情,12工作室详情,13话题,15求助详情,16监理详情
            // dataid 数据id, 可选

            const SW = new userShareWeb(VueInstance)
            SW.request({
              uid: shareUid || -1,
              shareMode: 1,
              pageUrl: url,
              pageTitle: wxShare.shareTitle,
              datatype: 7
            })
          },
          cancel: function (res) { //获取取消事件
          },
          fail: function (res) { //错误事件
            Toast('获取权限失败，请重新进入')
          }
        });

        wx.onMenuShareTimeline({ //分享到朋友圈
          title: title,
          link: link,
          imgUrl: imgUrl,
          trigger: function (res) {},
          success: function (res) {
            const SW = new userShareWeb(VueInstance)
            SW.request({
              uid: shareUid || -1,
              shareMode: 0,
              pageUrl: url,
              pageTitle: wxShare.shareTitle,
              datatype: 7
            })
          },
          cancel: function (res) {},
          fail: function (res) {
            Toast('获取权限失败，请重新进入')
          }
        });

        wx.onMenuShareQQ({ //分享到QQ
          title: title,
          desc: desc,
          link: link,
          imgUrl: imgUrl,
          trigger: function (res) {},
          complete: function (res) {},
          success: function (res) {
            const SW = new userShareWeb(VueInstance)
            SW.request({
              uid: shareUid || -1,
              shareMode: 2,
              pageUrl: url,
              pageTitle: wxShare.shareTitle,
              datatype: 4
            })
          },
          cancel: function (res) {},
          fail: function (res) {
            Toast('获取权限失败，请重新进入')
          }
        });

        wx.onMenuShareQZone({ //分享到QQ控件
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: link, // 分享链接
          imgUrl: imgUrl, // 分享图标
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        });
        wx.checkJsApi({
          jsApiList: [
            'getLocation'
          ],
          success: function (res) {
            // alert(JSON.stringify(res));
            // alert(JSON.stringify(res.checkResult.getLocation));
            if (res.checkResult.getLocation == false) {
              Toast('您的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！')
              return
            }
          }
        })
      })
    }, (err) => {
      Toast(err)
    })
  },
  getLoginData(c_name) {
    //原生环境
    if (this.isLocalEnv()) {
      return {
        uid: this.getUrlParam('uid') || '',
        userId: this.getUrlParam('uid') || '',
        serialNo: this.getUrlParam('serialNo') || '',
        authCode: this.getUrlParam('authCode') || ''
      }
    }
    //从cookie取得
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=")
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1
        let c_end = document.cookie.indexOf(";", c_start)
        if (c_end == -1) c_end = document.cookie.length
        return JSON.parse(JSON.parse(document.cookie.substring(c_start, c_end)))
      }
    }
    return {}
  },

  getQueryVariable(variable) {
    let query = window.location.search.substring(1)
    let vars = query.split("&")
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=")
      if (pair[0] == variable) {
        return pair[1]
      }
    }
    return false
  },
  //获取传入进来的时间所在月份的天数
  mGetDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var d = new Date(year, month, 0);
    return d.getDate();
  },
  //获取cookie信息
  getcookie: function (cookiename) {
    var cookiestring = document.cookie;
    var start = cookiestring.indexOf(cookiename + '=');
    if (start == -1) //   找不到 
      return null;
    start += cookiename.length + 1;
    var end = cookiestring.indexOf(";", start);
    if (end == -1) return decodeURIComponent(cookiestring.substring(start));
    return decodeURIComponent(cookiestring.substring(start, end));
  },

  //获取授权信息
  checkLogin: function () {
    if (this.isLocalEnv()) {
      var uid = this.getLoginData('loginUserAuthToken').userId;
      if (null == uid || '' == uid || uid == '-1') {
        let u = navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isiOS) {
          window.CallNativeLoginView('hybridAppInit')
          //window.CallNativeLoginView('hybridAppInit')
        } else if (isAndroid) {
          window.myObj.CallNativeLoginView("hybridAppInit")
          //window.myObj.CallNativeLoginView('hybridAppInit')
        }
        return;
      }
    } else {
      var uid = this.getLoginData('loginUserAuthToken').userId;
      if (null == uid || '' == uid) {
        window.location.href = config.MALL() + '/#/login';
      }
      return
      // let loginUser = this.getcookie('loginUserAuthToken');
      // let userInfo = JSON.parse(JSON.parse(loginUser));
      // if (null == loginUser || userInfo.bindMobile == '0') {
      //   window.location.href = config.MALL() + '/#/login';
      //   return false
      //   //$('body').append('<iframe class="login_phone_ifram" src="https://api.huihome.cn/mall/#/login"></iframe>')
      // }
      // return true
      // var browser = {
      //   versions: function () {
      //     var u = navigator.userAgent,
      //       app = navigator.appVersion;
      //     return { //移动终端浏览器版本信息
      //       trident: u.indexOf('Trident') > -1, //IE内核
      //       presto: u.indexOf('Presto') > -1, //opera内核
      //       webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      //       gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      //       mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      //       ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      //       android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
      //       iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      //       iPad: u.indexOf('iPad') > -1, //是否iPad
      //       webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
      //     };
      //   }(),
      //   language: (navigator.browserLanguage || navigator.language).toLowerCase()
      // }

      // if (browser.versions.mobile) {
      //   var ua = navigator.userAgent.toLowerCase();
      //   if (ua.match(/MicroMessenger/i) == "micromessenger") {
      //     var uid = this.getLoginData('loginUserAuthToken').userId;
      //     if (null == uid || '' == uid) {
      //       var callbackUrl = window.location.href;
      //       //window.location.href = 'https://api.huihome.cn/get-weixin-code.html?appid=wx1ccd7b38a96b2317&reurl=' + encodeURIComponent(callbackUrl);
      //       window.location.href = 'https://api.huihome.cn/huihome/api/oauth/wx?reurl=' + encodeURIComponent(callbackUrl + '&wx=1');

      //     }
      //   } else {
      //     var uid = this.getLoginData('loginUserAuthToken').userId;
      //     if (null == uid || '' == uid) {
      //       window.location.href = config.MALL() + '/#/login';
      //     }
      //   }
      // } else {

      //   var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
      //   if (ua.match(/MicroMessenger/i) == "micromessenger") { //在微信中打开
      //     var uid = this.getLoginData('loginUserAuthToken').userId;
      //     if (null == uid || '' == uid) {
      //       var callbackUrl = window.location.href;
      //       //window.location.href = 'https://api.huihome.cn/get-weixin-code.html?appid=wx1ccd7b38a96b2317&reurl=' + encodeURIComponent(callbackUrl);
      //       window.location.href = 'https://api.huihome.cn/huihome/api/oauth/wx?reurl=' + encodeURIComponent(callbackUrl + '&wx=1');
      //     }
      //   } else {
      //     var uid = this.getLoginData('loginUserAuthToken').userId;
      //     if (null == uid || '' == uid) {
      //       window.location.href = config.MALL() + '/#/login';
      //     }
      //   }
      // }
    }
  },
  //弹出提示
  vToast: function (str, str1) {
    let msgtxt = ''
    if (str.indexOf('{') != '-1') {
      msgtxt = str.replace('{', '<span>');
      msgtxt = msgtxt.replace('}', '</span>')
    } else {
      msgtxt = str1 || str
    }
    let div = document.createElement("div")
    div.setAttribute("class", "vue-toast");
    div.innerHTML = '<p>' + msgtxt + '</p>'
    document.getElementsByTagName('body')[0].appendChild(div)
    setTimeout(
      function () {
        document.getElementsByTagName('body')[0].removeChild(div)
      }, 1000);
  },
  emptiness: function (str, defaultStr) {
    if (str == '' || str == 'null' || str == null) {
      return defaultStr
    } else {
      return str
    }
  }

}
