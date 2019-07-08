<template>
    <div>
        <!--<video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>-->
        <div @click="commentHide=true">tanchuy</div>
        <textarea rows="5" id="com_input" type="text" placeholder="有什么想说的，直接评论吧! " style="width: 90%;background-color: #fff;margin-left: 5%;border-radius: 0.3em;border: 1px solid #989898;padding: 10px;"></textarea>
    </div>
</template>
<script>
import Vue from "vue"
import VideoPlayer from 'vue-video-player'
import commentTextarea from '../assembly/commentTextarea/commentTextarea'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)
import './text.scss'

export default {
    data() {
        return {
            commentHide: false,
            playerOptions: {
                playbackRates: false, //播放速度
                autoplay: true, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一   结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: "video/mp4",
                    src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" //url地址
                }],
                width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: false,
                    durationDisplay: false,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true  //全屏按钮
                }
            }
        }
    },
    components: {
        commentTextarea
    },

}
</script>
