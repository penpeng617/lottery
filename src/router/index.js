import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: resolve => require(['@/components/home'],resolve),//懒加载路由
      meta:{title:"抽奖"}
    },
    {
      path: '/lotteryResult',
      name: 'lotteryResult',
      component: resolve => require(['@/components/lotteryResult'],resolve),
      meta:{title:"抽奖结果"},
    },
    {
      path: '/lotteryResultTable',
      name: 'lotteryResultTable',
      component: resolve => require(['@/components/lotteryResultTable'],resolve),
      meta:{title:"抽奖结果表格"},
    },
  ]
})
