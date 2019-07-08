<template>
    <div class="bill-content">
        <div class="bill-totals">
            <div class="bill-title">账单总计</div>
            <div class="bill-date">2017/04/13~2018/03/29</div>
        </div>
        <div class="bill-echarts">
            <div id="myChart" :style="{width: '6.3rem', height: '6.3rem'}">
            </div>
            <div class="bill-expenditure">
                <div class="bill-expenditure-outer">
                    <p class="bill-expenditure-title">总支出</p>
                    <p class="bill-expenditure-num">{{ownerBill.totalFee}}</p>
                </div>
            </div>
        </div>
        <div class="bill-fee-list">

            <div v-for="(item,index) in ownerBill " :key="index" class="bill-fee" @click="toBillDetail(ownerid,item.feeType)">
                <div class="df">
                    <div class="bill-color" v-bind:class="`bill-color-${index+1}`"> </div>
                    <p class="bill-type">{{item.feeName}}</p>
                </div>
                <div class="df">
                    <p class="bill-num">{{item.fee}}元</p>
                    <img class="bill-arrow" src="./img/tiaozhuan.png">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import './ownerEcharts.scss'
export default {
    name: 'ownerEcharts',
    props: ['ownerBill', 'ownerid'],
    data() {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    },
    mounted() {
        this.drawLine();
    },
    methods: {
        toBillDetail: function(ownerid, feeType) {
            this.$router.push({
                name: 'ownerBillDetail',
                query: {
                    ownerid: ownerid,
                    feeType: feeType
                }
            })
        },
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            let billItemslength = this.ownerBill.length
            let billItemsData = [];
            console.log(this.ownerBill)
            for (let i = 0; i < billItemslength; i++) {

                billItemsData.push({ name: this.ownerBill[i].feeName, value: this.ownerBill[i].fee })
            }
            let option = {
                series: [{
                    type: 'pie',
                    radius: '100%',
                    data: billItemsData,
                    label: {
                        normal: {
                            show: false,
                            position: 'outside'
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    //取消任何鼠标事件
                    silent: [true],
                    color: [
                        '#eb72b1', '#61c8a0', '#ffa207', '#a689cb', '#abd678', '#ff6262', '4eaaff'
                    ]
                },
                ]
            };
            myChart.setOption(option);
        }
    }
}
</script>
