<template>
    <div class="cell-list">
        <mt-loadmore :top-method="loadTop" ref="loadmore" :bottom-method="infinite" :auto-fill="false">
            <div class="cell-div" v-for="(item,index) in cellList" @click="toCellDetail(item.id,item.cellType)" :key="index">
                <img class="cell-img" :src="emptiness(item.coverimg,defaultI)" />
                <div class="cell-infor">
                    <p class="cell-name">{{item.cellname}}
                        <span>/{{item.city}}</span>
                    </p>
                    <div class="cell-data">
                        <p>团队人数&nbsp;&nbsp;{{item.number}}</p>
                        <p>工地数&nbsp;&nbsp;{{item.projCount}}</p>
                        <p v-if="item.cellType!='4'">作品数&nbsp;&nbsp;{{item.workCount}}</p>
                        <p v-else>粉丝数&nbsp;&nbsp;{{item.followCount}}</p>
                    </div>
                    <div class="cell-data2">
                        <div class="cell-stars">
                            <stars :starsObj="{score:item.score,maxScore:5}"></stars>
                            <span>{{parseFloat(item.score ).toFixed(1)}}</span>
                        </div>
                        <p v-if="item.cellType!='4'">粉丝数&nbsp;&nbsp;{{item.followCount}}</p>
                    </div>
                </div>
            </div>
        </mt-loadmore>
    </div>
</template>
<script>
import {
    Toast,
    Indicator,
} from 'mint-ui';
import './cellList.scss'
import utils from '../../../common/utils'
import stars from '../../assembly/stars/stars'
import cellList from '../../../common/cell/cellList.class'
export default {
    data: function() {
        return {
            cellList: [],
            pageIndex: 1,
            defaultI: require('./img/shangjialiebiao_morentu.png')
        }
    },
    mounted: function() {
        this.active();
    },
    methods: {
        emptiness: function(str, defaultStr) {
            return utils.emptiness(str, defaultStr)
        },
        active: function() {
            let OD = new cellList(this)
            let loginUser = utils.getLoginData('loginUserAuthToken');
            let reqParam = {
                pageIndex: this.pageIndex,
                pageSize: '10'
            }
            Indicator.open({
                text: '加载中...'
            });
            OD.request(reqParam).then((res) => {
                Indicator.close();
                if (res.body.respCode == "00") {
                    this.pageIndex++
                    let start = res.body.body.ceList.length;
                    if (this.pageIndex > 2) {
                        if (start > 0) {
                            for (let i = 0; i < start; i++) {
                                this.cellList.push(res.body.body.ceList[i])
                            }
                        }
                    } else {
                        this.cellList = res.body.body.ceList
                    }
                } else {
                    Toast(res.body.respMsg)
                }

                if (this.pageIndex > 2) {
                    setTimeout(() => {
                        this.$refs.loadmore.onBottomLoaded();
                    }, 500)
                }
            }).catch((e) => {
                Indicator.close();
                Toast(e);
            })
        },
        //跳转工作室详情
        toCellDetail: function(id, type) {
            this.$router.push({
                name: 'cellDetail',
                query: {
                    cellId: id,
                    cellType: type
                }
            })
        },
        //加载更多
        infinite: function() {
            this.active();
        },
        //刷新页面
        loadTop: function() {
            this.pageIndex = 1
            this.active();
            setTimeout(() => {
                this.$refs.loadmore.onTopLoaded();
            }, 500)
        },
    },
    components: {
        stars,
    }
}
</script>
