<template >
    <div class="bottomLoad">
        <div class="load" @click="toload()">
            打开绘装APP，查看更多精彩作品
        </div>
    </div>
</template>
<script >
import './bottomLoad.scss'
export default {
    methods: {
        toload: function() {
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.cs.decoration"
        }
    }
}
</script>
