# lottery

> 年会3D抽奖，奖项设置，表单导出

## Build Setup
demo预览：https://blog.csdn.net/p1382526/article/details/103892834
``` bash
# install dependencies
//安装依赖
npm install
//接口请求
npm install axios --save
//随机模拟数据库
npm install mockjs --save-dev

//此处安装需要将中奖名单已excel表格格式下载到本地
npm i element-ui -S
npm install js-xlsx file-saver -S
npm install script-loader -S -D //它帮我们挂载了，不需要引入到main.js里面

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
