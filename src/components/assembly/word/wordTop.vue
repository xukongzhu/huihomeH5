<template>
    <div>
        <div class="word_top_div">
            <div class="overall_evaluation_div">
                <p>专业水平</p>
                <p>{{parseFloat(item.scoreProf).toFixed(1)}}</p>
                <p v-if="parseFloat(item.scoreProfDeta)>0">高于平均
                    <span>{{parseInt(Math.abs(parseFloat(item.scoreProfDeta))*100)}}% ↑</span>
                </p>
                <p v-else>低于平均
                    <span class="c8">{{parseInt(Math.abs(parseFloat(item.scoreProfDeta))*100)}}% ↓</span>
                </p>
            </div>
            <div class="overall_evaluation_div">
                <p>服务态度</p>
                <p>{{parseFloat(item.scoreManner).toFixed(1)}}</p>
                <p v-if="parseFloat(item.scoreMannerDeta)>0">高于平均
                    <span>{{parseInt(Math.abs(parseFloat(item.scoreMannerDeta))*100)}}% ↑</span>
                </p>
                <p v-else>低于平均
                    <span class="c8">{{parseInt(Math.abs(parseFloat(item.scoreMannerDeta))*100)}}% ↓</span>
                </p>
            </div>
            <div class="overall_evaluation_div">
                <p>直播互动</p>
                <p>{{parseFloat(item.scoreActive).toFixed(1)}}</p>
                <p v-if="parseFloat(item.scoreActiveDeta)>0">高于平均
                    <span>{{parseInt(Math.abs(parseFloat(item.scoreActiveDeta))*100)}}% ↑</span>
                </p>
                <p v-else>低于平均
                    <span class="c8">{{parseInt(Math.abs(parseFloat(item.scoreActiveDeta))*100)}}% ↓</span>
                </p>
            </div>
        </div>
       
    </div>
</template>
<script>
import './wordTop.scss'
export default {
    props: ['item'],
}
</script>

