export default {
  startx: 0,
  scrollTop: 0,

  start: function (sc, e) {
    this.startx = e.changedTouches[0].pageX
    this.scrollTop = document.getElementsByClassName('content')[0].scrollTop
  },
  move: function (sc, e) {
    if (document.getElementsByClassName('content')[0].scrollTop > 50 && e.changedTouches[0].pageX > this.startx) {
      sc.state.menutopShow = 'Top'
      sc.startx = e.changedTouches[0].pageX
    } else if (document.getElementsByClassName('content')[0].scrollTop <= 50 || e.changedTouches[0].pageX < this.startx) {
      sc.state.menutopShow = 'Bottom'
      sc.startx = e.changedTouches[0].pageX
    }
  },
  scroll: function (sc) {
    if (document.getElementsByClassName('content')[0].scrollTop > 50 && document.getElementsByClassName('content')[0].scrollTop > this.scrollTop) {
      sc.state.menutopShow = 'Top'
    } else if (document.getElementsByClassName('content')[0].scrollTop <= 50 || document.getElementsByClassName('content')[0].scrollTop < this.scrollTop) {
      sc.state.menutopShow = 'Bottom'
    }
  },
}
