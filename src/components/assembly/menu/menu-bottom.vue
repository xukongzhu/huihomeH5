<template>
    <div class="menuBottom">
        <div v-for="(item,index) in menuList" :key="index" class="menu_bottom_optiont" @click="toList(item.href)">
            <img v-if="menuType==item.type" :src="require(`./img/${item.type}_1.png`)">
            <img v-else :src="require(`./img/${item.type}.png`)">
            <p v-bind:class="{'select':menuType==item.type}">{{item.name}}</p>
        </div>
    </div>
</template>
<script>
import './menu-bottom.scss'
import config from '../../../common/config.class'
export default {
    props: ['menuType'],
    data() {
        return {
            menuList: [{
                name: '首页',
                type: 'home',
                href: config.SERVERADD() + '/huihome/api/home/index/0.html'
            },
            {
                name: '设计',
                type: 'desi',
                href: config.SERVERADD() + '/huihome/api/designer/list'
            },
            {
                name: '发现',
                type: 'find',
                href: config.SERVERADD() + '/huihome/api/home/find'
            },
            {
                name: '施工',
                type: 'pm',
                href: config.SERVERADD() + '/huihome/api/pm/list'
            },
            {
                name: '商城',
                type: 'mall',
                href: config.SERVERADD() + '/huihome/api/mer/home'
            }
            ]
        }
    },
    methods: {
        toList: function(href) {
            window.location.href = href
        }
    }
}
</script>

