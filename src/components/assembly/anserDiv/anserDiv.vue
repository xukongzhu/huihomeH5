<template>
    <div class="anserDiv">
        <dynamicContent :item="item"></dynamicContent>
    </div>
</template>
<script>
import './anserDiv.scss'
import dynamicContent from '../dynamicContent/dynamicContent'
export default {
    props: ['item'],
    components: {
        dynamicContent
    }
}
</script>
