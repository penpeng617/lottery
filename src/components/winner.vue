<template>
    <div>
        <div class='winnerBox'>
            <p class='winnerTit'>本次中奖名单</p>
            <div class='winnerList' v-for="(item ,index) in list"  :key="index" >
              <p>{{item.name}}：{{item.phone}}</p>
            </div>
        </div>
        
    </div>
</template>
<script>
import BUS from '../assets/js/bus'
export default {
  data () {
    return {
      list:[]
    }
  },
  mounted(){
    var _this =this;
    BUS.$on("ret",function(val){
        _this.list = val;
    });
  },
  
}
</script>
<style scoped>
 @import '../assets/css/com.css';
 .winnerList{margin-top:10px;margin-left:40px;}
 .winnerList p{
  font-size:16px;
  text-align:left;

 }
</style>