<template>
    <div class="commentBottom">
        <input placeholder="点赞都是套路"/>
        <div>
            <img src="../images/btn_zan.png" />
            <span>{{appraiseCount}}</span>
        </div>
         <div>
            <img src="../images/btn_pinglun.png" />
            <span>{{commentCount}}</span>
        </div>
         <div>
            <img src="../images/btn_shoucang.png" />
            <span>{{favoriteCount}}</span>
        </div>
    </div>
</template>
<script>
import './commentBottom.scss'
import utils from '../../common/utils'
export default {
    name: 'commentBottom',
    props: ['appraiseCount','commentCount','favoriteCount'],
    data() {
        return {

        }
    },
    methods: {

    },

}
</script>