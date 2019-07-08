export default {
  SERVERADD: function () {
    let windowHref = window.location.href;
    if (windowHref.indexOf('localhost') > 0) {
      return 'http://api.huihome.cn:8082' //本地环境
    } else if (windowHref.indexOf('huihome.cn:8443') > 0) {
      return 'https://api.huihome.cn:8443' //测试环境
    } else {
      return 'https://api.huihome.cn' //正式环境
    }
  },
   MALL: function () {
    let windowHref = window.location.href;
    if (windowHref.indexOf('localhost') > 0) {
      return 'https://api.huihome.cn/mallTest' //本地环境
    } else if (windowHref.indexOf('huihome.cn:8443') > 0) {
     return 'https://api.huihome.cn:8443/mallTest' //本地环境
    } else {
     return 'https://api.huihome.cn/mall' //本地环境
    }
  }
}
