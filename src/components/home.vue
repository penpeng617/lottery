<template>
    <div>
        <div class="participateNum">参与人数：{{participateNum}}人</div>
        <awards  :list.sync="list" ></awards>
        <canvas-div :list.sync="list" ref="canvasBox" ></canvas-div>
        <winner></winner>
        <div class='positionCenter' ref='awardsEnd'>活动结束!</div>
    </div>
</template>
<script>
import awards from '@/components/awards'
import winner from '@/components/winner'
import canvas from '@/components/canvas'  
import axios from 'axios'
import mock from '../mock'
import demoList from '../mock/demoList'
export default {
  name: 'home',
  data () {
    return {
      list:[],
      participateNum: 0,
      mainCanvas:"",
    }
  },
  components:{
    awards,
    winner,
    'canvas-div':canvas
  },
  mounted(){
      let _this =this;
      //canvas组件用的watch监听属性，所以必须在此处赋值
      let  list  =JSON.parse(localStorage.getItem('lotteryList')) || [];
      if(list.length >0){
        _this.list = list;
        _this.participateNum= _this.list.length;
      }else{
        axios.get('/parameter/query').then(res=>{
            let data = res.data.data.list;
            _this.list = data;
             _this.participateNum= _this.list.length;
            localStorage.setItem("lotteryList",JSON.stringify(data));
              
        })
      }
  },
  updated (){
    this.mainCanvas = document.getElementById('mainCanvas');
  },
  methods:{

  }
}
</script>
<style scoped>
 @import '../assets/css/com.css';
.participateNum{top:1%;right:5%;height:50px;line-height:50px;width:200px;border-radius:30px;}
.positionCenter{display:none;background:#fff;color:red;font-weight:bolder;letter-spacing: 6px;font-size:32px;width:300px;height:100px;line-height:100px;text-align:center;border-radius: 10px;}

</style>