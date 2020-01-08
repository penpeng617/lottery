<template>
    <div class='awardsBox' >
        <div class='awardsList' >
            <button class='icon' :class='{disabledGray:prizeBeforeButt}'  :disabled='prizeBeforeButt' @click.stop.prevent='prizeChange(0)' onfocus="this.blur()"><</button>
            <span>{{prize.name}}</span>
            <button class='icon' :class='{disabledGray:prizeAfterButt}' :disabled='prizeAfterButt' @click.stop.prevent='prizeChange(1)' onfocus="this.blur()">></button>
        </div>
        <img class='awardsImg' src="../assets/defaultaward.jpg" />
        <div class='awardsNumSet'>
        抽取人数：<button class="icon iconNum iconNumLess" style='line-height:30px;'  
              :class='{iconNumDisabled:isLess}'  :disabled='isLess' @click.stop.prevent='awardsNumChange(0)' onfocus="this.blur()">-</button>
                <input type='text' class='awardsNum' v-model="prize.partNum"  @input='changeNum'  :readonly="readonlyInput"/>
                <!-- <span class='awardsNum'>{{prize.partNum}}</span> -->
                <button class="icon iconNum iconNumAdd"
                 :class='{iconNumDisabled:isAdd}'  :disabled='isAdd' @click.stop.prevent='awardsNumChange(1)' onfocus="this.blur()">+</button>
        </div>
        <div>
          <!-- :disabled="disabledFlag" 控制鼠标是否可以单击 disabled="disabled"控制鼠标不可单击-->
          <button
              class="awardsStart pure-button"
              @click.stop.prevent="awardsStart"
              disabled="disabled"
              :class="{'button-secondary': !running,
               'button-success': running}" 
               ref='startButt'  onfocus="this.blur()"
               title = '按下空格键开始抽奖'
               >{{running?'停!':'开始抽奖'}}  
               </button>
        </div>
        <router-link to='/lotteryResult'  class='lotteryResult'>查看抽奖结果</router-link>
    </div>
</template>
<script>
import tagcanvas from '../assets/js/tagcanvas'
import BUS from '../assets/js/bus'

export default {
  props:["list"],
  data () {
    return {
      prizesList:[
        {id:1,index:0,name:"一等奖",totalNum:3,remainingDraw:3,partNum:3,prize:"手机一部",person:[]},
        {id:2,index:1,name:"二等奖",totalNum:10,remainingDraw:10,partNum:5,prize:"耳机一个",person:[]},
        {id:3,index:2,name:"三等奖",totalNum:30,remainingDraw:30,partNum:15,prize:"水杯一个",person:[]},
        {id:4,index:3,name:"特等奖",totalNum:70,remainingDraw:70,partNum:20,prize:"随手礼一份",person:[]}
      ],
      prize:{},//当前奖项
      prizeBeforeButt:true,//前一项
      prizeAfterButt:false,//后一项
      isLess:true,//减少
      isAdd:false,//增加
      index:0,//奖项前进后退标识
      running: false,//抽奖
      disabledFlag:false,//是否可以抽奖
      lotteryDrawnPerson:[],//所有中奖人员
      lotteryTotalNum:0,//活动奖品总个数
      maxPartNum:20,//单次最多抽奖次数
      readonlyInput:false,//输入框是否可以输入值
    }
  },
  created(){
    this.keyupEnter()
 },
  mounted (){
    let _this= this;
    //中奖结果
    let winningResult = JSON.parse(localStorage.getItem('winningResult')) || [];
    if(winningResult.length != 0){
        _this.prizesList = winningResult;
        _this.prizesList.map((item,index) =>{
            _this.lotteryDrawnPerson = _this.lotteryDrawnPerson.concat(item.person);
        })
    }
    
    _this.setPrize();
    
    //去掉默认的contextmenu事件，否则会和右键事件同时出现。
    document.oncontextmenu = function(e){
        e.preventDefault();
    };
    document.body.onmousedown = function(e){
        if(e.button ==0){//0：左键 1：滚轮 2：右键
            _this.$parent.$refs.canvasBox.$refs.maskFalg.classList.remove("mask");//canvas取消遮罩模糊效果
        }
    }
    _this.prizesList.forEach((item) =>{
       _this.lotteryTotalNum += item.totalNum;
    })
    _this.isLotteryEnd();
  },
  methods:{
      keyupEnter(){
        var _this =this;
          document.body.onkeydown = e =>{
              let body = document.getElementsByTagName('body')[0]
              // keyCode 13：回车键（enter） 32：空格键（space）
              if (e.keyCode === 32  &&  e.target === body) {
                if(!_this.disabledFlag){
                    _this.awardsStart()
                }else{
                    alert("本轮抽奖已完毕！");
                     _this.$parent.$refs.canvasBox.$refs.maskFalg.classList.remove("mask");//canvas取消遮罩模糊效果
                }
               
              }
          }
      },
      // 监听输入框值得变化
      changeNum(){
        let num = parseInt(this.prize.partNum),
            totalNum =parseInt(this.prize.totalNum),
            remainingDraw = parseInt(this.prize.remainingDraw),//剩余奖项数量
            maxPartNum = parseInt(this.maxPartNum);
        if(!num){
          if(remainingDraw >1){
              num =1;
              this.isAdd =false;
          }else{
              num =0;
              this.isAdd =true;
          }
        }else{
          if(num > remainingDraw){
            if(totalNum < maxPartNum ){
                num = totalNum;
                this.isAdd =true;
            }else{
              if(remainingDraw >maxPartNum){
                  num = this.maxPartNum;
                  this.isAdd =true;
              }else{
                num = remainingDraw;
                this.isAdd =true;
              }
            }
            
          }
        }
        this.isLess = num == 1 ? true:false;
        this.prize.partNum =num;
      },
      //设置奖项
      setPrize(){
        this.prize = this.prizesList[this.index];
        this.setPartNumButt();
        this.awardsIsEnd();
      },
      //奖项等级选择  type0:后退；1：前进
      prizeChange(type){
        let maxLen = parseInt(this.prizesList.length)-1;
        if(type ==0){
          this.index--;
          if(this.index== 0 ){ 
            this.prizeBeforeButt = true;
            this.prizeAfterButt = false;
          }else{
            this.prizeBeforeButt = false;
            this.prizeAfterButt = false;
          }
        }else if(type ==1){
            this.index++;
            if(this.index == maxLen){
              this.prizeBeforeButt = false;
              this.prizeAfterButt = true;
            }else{
              this.prizeBeforeButt = false;
              this.prizeAfterButt = false;
            }
        }
        this.setPrize();
      },
      //奖项数量的增减按钮控制
      setPartNumButt(){
        let num = parseInt(this.prize.partNum),
            remainingDraw = parseInt(this.prize.remainingDraw);//剩余奖项数量
          if(remainingDraw == 0){
            this.isAdd =true;
            this.isLess =true;
          }else{
              if(num >= remainingDraw){
                this.isAdd =true;
                this.isLess = num == 1 ? true:false;
              }else{
                this.isAdd =false;
                this.isLess = num == 1 ? true:false;
              }
            
          }

      },
      //单次抽奖人数变更 type | 0：减少 1：增加
      awardsNumChange (type){
        let awardsNum = parseInt(this.prize.partNum),//当前抽奖数量
            remainingDraw = parseInt(this.prize.remainingDraw);//剩余抽奖数量
        if(type ==0){
            if(awardsNum <= remainingDraw){
                awardsNum--;
                this.isAdd =false;
                if(awardsNum == 1){
                    this.isLess =true;
                    this.isAdd =false;
                }
           }
        }else if(type==1){
           if(remainingDraw > awardsNum){
                if(awardsNum >= parseInt(this.maxPartNum)){
                  alert("一次最多只能抽取20个人");
                  return false;
                }
                awardsNum++;
                this.isLess =false;
                this.isAdd =false;
                if(remainingDraw == awardsNum){
                    this.isAdd =true;
                }
           }
        }
        this.prize.partNum=awardsNum;
      },
      
      //开始抽奖
       awardsStart: function(){
         var _this =this;
          //判断是否人员都已中奖
          if(parseInt(_this.lotteryDrawnPerson.length) == parseInt(_this.list.length)){
           alert("所有成员均已中奖，请添加新的成员，再进行抽奖活动！");
           return false;
          }
          
          if(_this.running){//停止
              _this.$refs.startButt.innerHTML = "开始抽奖";
              TagCanvas.SetSpeed('myCanvas', _this.speed());
              var ret = _this.lottery(_this.prize.partNum);
              if (ret.length === 0) {
                  alert("此奖项已抽取完毕！");
                  return false;
              }
              
              TagCanvas.Reload('myCanvas');
              setTimeout(function(){
                  localStorage.setItem(new Date().toString(), JSON.stringify(ret));
                  _this.$parent.$refs.canvasBox.$refs.maskFalg.classList.add("mask");//canvas添加遮罩模糊效果
              }, 300);
              //
              _this.isLotteryEnd();
          } else {//开始
              _this.$refs.startButt.innerHTML = "停！";
              _this.$parent.$refs.canvasBox.$refs.maskFalg.classList.remove("mask");//canvas取消遮罩模糊效果
              TagCanvas.SetSpeed('myCanvas', [5, 1]);
          }
          _this.running = !_this.running;
      } ,
      //判断所有奖项是否都已抽取完毕
      isLotteryEnd:function(){
        let _this =this;
        if(parseInt(_this.lotteryTotalNum) == parseInt(_this.lotteryDrawnPerson.length) ){
          setTimeout(function(){
              _this.$parent.$refs.awardsEnd.style.display ="block";
          }, 1000);
        }
      },
      //判断当前奖项是否已抽完
      awardsIsEnd:function(){
        let remainingDraw = parseInt(this.prize.remainingDraw);//剩余奖项数量
        if(remainingDraw <= 0 ){
          this.disabledFlag = true;
          this.readonlyInput = true;
          this.$refs.startButt.innerHTML = this.prize.name+"已抽完";
        }else{
          this.disabledFlag = false;
          this.readonlyInput = false;
          this.$refs.startButt.innerHTML = "开始抽奖";
        }
      },
      //抽奖
      lottery(count){
        count = parseInt(count);
        let _this =this,
        
          listDom = _this.$parent.$refs.canvasBox.$refs.mainCanvas.getElementsByTagName('a'),
          color = 'yellow',
          ret = _this.list
            .filter(function(m, index){
                m.index = index;
                return !_this.inArray(_this.lotteryDrawnPerson,_this.getKey(m));
            })
            .map(function(m){
                return Object.assign({
                score: Math.random()
                }, m);
            })
            .sort(function(a, b){
                return a.score - b.score;
            })
            .slice(0, count)
            .map(function(m){
              _this.lotteryDrawnPerson[_this.getKey(m)] = 1;
              listDom[m.index].style.color = color;
              return  {name:m.name,phone:m.phone}; 
            });
            //中奖信息做缓存
            _this.prizesList[_this.index].remainingDraw=parseInt(_this.prize.remainingDraw) - parseInt(_this.prize.partNum);
            _this.prizesList[_this.index].person=ret.concat(_this.prizesList[_this.index].person);
            _this.lotteryDrawnPerson = _this.lotteryDrawnPerson.concat(ret);

            let partNum = parseInt( _this.prizesList[_this.index].partNum),
                remainingDraw =parseInt( _this.prizesList[_this.index].remainingDraw);//剩余奖项数量
            if(remainingDraw < partNum){
                _this.prizesList[_this.index].partNum  = remainingDraw;
            }
            _this.setPrize();
            localStorage.setItem('winningResult', JSON.stringify(_this.prizesList));
            localStorage.setItem('lotteryDrawnPerson', JSON.stringify(_this.lotteryDrawnPerson));
            BUS.$emit("ret" ,ret);
            return ret;
      },
      getKey (item){
            return {name:item.name,phone:item.phone};
      },
      speed(){
          return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
      },
       //判断某人是否已中奖
      inArray (array,search){
        let flag = false;
        array.forEach((item) =>{
            if(item.phone==search.phone){
                flag =true;
            }
        });
        return flag;
    }
  },
  
}
</script>
<style scoped>
      @import '../assets/css/com.css';
      @import '../assets/css/award.css';
      .button-success,
      .button-warning,
      .button-secondary {
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      }
</style>