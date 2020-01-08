<template>
    <div style='overflow-y:scroll;height:100%'>
      <router-link to ='/lotteryResultTable' class='resultTable'>下载excel表格</router-link>
        <div class='resultList'  v-for='(item,index) of list' :key='index'>
            <h1>{{item.name}}<span class='prizeName'>（{{item.prize}}）</span></h1>
            <div class='personList' style='float:left' v-for = '(it,ind) of item.person' :key='ind'>
                {{it.name}}：{{it.phone}}
            </div>
        </div>
        <router-link to>
            <span  class='goback yellowButt'  @click="$router.back(-1)">返回抽奖</span>
        </router-link>
    </div>
</template>
<script>
export default {
  data () {
    return {
      list:[]
    }
  },
  mounted(){
   //中奖结果
    this.list = JSON.parse(localStorage.getItem('winningResult')) || [];
  },
  
}
</script>
<style scoped>
.resultTable{position:absolute;right:5%;top:20px;color:#fff;}
 .resultList{color:#fff;padding:20px;font-size:20px;}
 .resultList:after{content:'';clear: both;display: block;height:0;visibility: hidden;}
 h1{margin-bottom:20px}
 .prizeName{font-size:18px}
 .personList{margin-bottom:10px;margin-right:36px;float:left;width:226px;}
 .goback{position:fixed;right:5%;bottom:20px;border-radius: 50%;width:46px;height:46px;text-align: center;padding:10px;
 color: #FFF0C7;cursor: pointer;
   background: -webkit-linear-gradient(bottom, #F1B41B 0%, #C26503 100%);
  background: -moz-linear-gradient(bottom, #F1B41B 0%, #C26503 100%);
  background: -o-linear-gradient(bottom, #F1B41B 0%, #C26503 100%);
  background: linear-gradient(to bottom, #F1B41B 0%, #C26503 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=#F1B41B, endColorstr=#C26503, GradientType=1);}

</style>
