<template>
<div id="stars" class="stars">
    <div v-for="(item,index) in scoreTrans" :key="index" class="singleStar">
        <img class="star" src="./img/star.png" alt="">
        <div class="bac" :style="`transform:scaleX(${item})`"></div>
        <div class="bac-none"></div>
    </div>
</div>
</template>
<script>
import './stars.scss'
export default {
    props: ['starsObj'],
    name: "stars",
    data: function() {
        return {}
    },
    computed: {
        scoreTrans: function() {
            let list = []
            try {
                this.starCalc(list, this.starsObj.score, this.starsObj.maxScore)
                return list
            } catch (e) {
                console.warn(e)
            }
            return [1, 1, 1, 1, 1]
        }
    },
    methods: {
        starCalc: function starCalc(list, score, max) {
            if (score > max) {
                throw new RangeError('数值越界')
            }
            if (score > 1) {
                score--
                list.push(1)
                starCalc(list, score, max)
                return
            }
            list.push(score)
            score = 0
            if (list.length < max) {
                let insertCount = max - list.length
                for (let i = 0; i < insertCount; i++) {
                    list.push(0)
                }
            }
        }
    }
}
</script>
<style>

</style>
