<template>
  <div>
    <div class='downExcel'>
        <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >下载excel</el-button>
    </div>
    <el-table id="excel-table" ref="filterTable" :data="tableList" style="width: 100%">
      <el-table-column prop="name" label="姓名"  width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号"  width="180" column-key="date"></el-table-column>
      <el-table-column prop="id" label="中奖等次" sortable width="180"></el-table-column>
      <el-table-column prop="prizename" label="奖项名称" width="180"></el-table-column>
      <el-table-column prop="prize" label="礼品"></el-table-column>
      <el-table-column prop="tag" label="是否已领取" width="100" filter-placement="bottom-end"></el-table-column>
    </el-table>
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableList: []
    };
  },
  mounted() {
    //中奖结果
    let _this = this;
    const list = JSON.parse(localStorage.getItem('winningResult')) || [];
    if(list.length>0){
      list.forEach((item) => {
        let person = item.person;
        if(person.length>0 ){
          person.forEach((it) =>{
            let newPerson = it;
            newPerson.id = item.id;
            newPerson.prizename = item.name;
            newPerson.index = item.index;
            newPerson.prize = item.prize;
            newPerson.tag = "未领取";
            _this.tableList.push(newPerson);
          })
        }
      })
    }
    
  },
  methods: {
    handleDownload() {
      // this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["姓名", "手机号",  "奖项名称", "礼品", "是否已领取"]; //要导出后表头是什么，可以跟tableDate中的表头不一致
        const filterVal = ["name", "phone",  "prizename",  "prize", "tag"];
        const data = this.formatJson(filterVal, this.tableList);

        // const data = this.tableList;
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "lottery-winner" //导出文件的名，自定义就好
        });
        // this.downloadLoading = false;
      });
    },
    //下载方法中，需要用到的格式化json的方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "id") {
            //此处如没有要格式化的列，可以不用此判断
            // return parseTime(v[j])
            return v[j];
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style scoped>
.downExcel{text-align:right;background:#fff}
</style>
