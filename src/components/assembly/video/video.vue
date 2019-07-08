<template>
  <div class="hello">
    <div id="J_prismPlayer" class="prism-player"></div>
  </div>
</template>
<script>
import './video.scss'
export default {
  name: 'video',
  data() {
    return {
  
    }
  },
  mounted: function() {
    let player = new Aliplayer({
      id: 'J_prismPlayer',
      width: '100%',
      height: '6.62rem',
      autoplay: false,
      useH5Prism: true,
      source: 'http://cloud.video.taobao.com/play/u/2554695624/p/1/e/6/t/1/fv/102/28552077.mp4',
      //播放方式一：推荐
      prismType: 2,
      vid: '',
      accId: '',
      accSecret: '',
      apiKey: '',
      skinLayout: [{ name: "bigPlayButton", align: "cc"},
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
      cover: 'http://liveroom-img.oss-cn-qingdao.aliyuncs.com/logo.png'
    });
  },
  components: {
    //'ali-player': VueAliplayer
  },
  methods: {
    play() {
      console.log('play callback')
    }
  },
}
</script>
