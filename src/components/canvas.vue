<template>
    <div class='canvasBox' ref="maskFalg">
        <div class='canvas' id='mainCanvas' ref="mainCanvas" >

        </div>
        
    </div>
</template>
<script>
import tagcanvas from '../assets/js/tagcanvas'
import BUS from '../assets/js/bus'

export default {
  data () {
    return {
      lotteryDrawnPerson:JSON.parse(localStorage.getItem('lotteryDrawnPerson')) || [],
    }
  },
  props:["list"],
  methods:{
      creatCanvas :function(){
            var _this =this;
            var createHTML = function(){
                var html = [ '<ul>' ];
                _this.list.forEach(function(item){
                    var key = _this.getKey(item);
                    var color = _this.inArray(_this.lotteryDrawnPerson,key)? 'yellow' : 'white';
                    html.push('<li><a href="#" style="color: ' + color + ';">' + item.name + '</a></li>');
                });
                html.push('</ul>');
                return html.join('');
            };
            var canvas = document.createElement('canvas');
            canvas.id = 'myCanvas';
            canvas.width = document.body.offsetWidth;
            canvas.height = document.body.offsetHeight;
            document.getElementById('mainCanvas').appendChild(canvas);

            canvas.innerHTML = createHTML();
            TagCanvas.Start('myCanvas', '', {
                textColour: null,
                initial: _this.speed(),
                dragControl: 1,
                textHeight: 14
            });
      },
      speed(){
          return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
      },
      getKey (item){
            return {name:item.name,phone:item.phone};
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
  watch: {
    list(newVal, oldVal) {
      const _this = this;
      if(newVal.length){
           _this.creatCanvas();
      }
     
    }
  }
}
</script>
<style scoped>
    .canvas,.mask {position:fixed;left:50%;top:50%;transform:translateX(-50%) translateY(-50%);color:#fff}
    .mask {-webkit-filter: blur(5px);filter: blur(5px);}
</style>