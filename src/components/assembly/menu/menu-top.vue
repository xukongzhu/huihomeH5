<template>
    <div class="menuTop"  v-once>
        <div class="data">
            <img src="./img/top_logo.png" />
            <div class="a">
                <p>绘装APP</p>
                <p>让装修更透明</p>
            </div>
        </div>
        <div class="land" @click="toLand()">
            立即下载
        </div>
    </div>
</template>
<script>
import './menu-top.scss'
export default {
    methods: {
        toLand: function() {
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.cs.decoration"
        }
    }
}
</script>
