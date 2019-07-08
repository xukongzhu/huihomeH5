<template>
    <div id="app">
        <!--<menuTop v-if="!$store.state.menutopHide" :class="'menuScorll'+$store.state.menutopShow"></menuTop>-->
        <keep-alive>
            <router-view>
            </router-view>
        </keep-alive>
    </div>
</template>

<script>
import menuTop from './components/assembly/menu/menu-top.vue'
import Vue from 'vue'
import utils from './common/utils.js'
import avtiveInit from './common/activityInit.class'

export default {
    name: 'app',
    mounted: function() {
        utils.remCalc(1242)
    },
    components: {
        menuTop,
    },
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    overflow: hidden;
    height: 100%;
}

.mint-loadmore {
    min-height: 100%;
}

.vue-toast {
    position: fixed;
    max-width: 80%;
    border-radius: 5px;
    background: rgba(0, 0, 0, .7);
    color: #fff;
    box-sizing: border-box;
    text-align: center;
    z-index: 1000;
    transition: opacity .3s linear;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 10px;
}

.vue-toast p {
    font-size: 14px;
    display: block;
    text-align: center;
}

.vue-toast p span {
    color: #ff8d36
}

.mint-loadmore-text {
    font-size: .48rem;
    color: #989898;
}

.c3db8 {
    color: #3db8a8 !important;
}

.content {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
    padding-top: 1.47rem;
    padding-bottom: 1rem;
    /*touch-action: auto !important;
    -webkit-user-drag: auto !important;*/
}

body,
html {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
}

* {
    padding: 0;
    margin: 0;
    line-height: 1;
    box-sizing: border-box;
}
</style>
