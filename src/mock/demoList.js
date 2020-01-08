
// 使用 Mock

let Mock = require('mockjs')

let data = Mock.mock({

  'list|600': [{
  'id|+1': 1,
  'name':'@cname',
  'phone':/^1(3|4|5|7|8)\d{9}$/,
  }]

})



export default {
    'get|/parameter/query':  option => {
    return {
      status: 200,
      message: 'success',
      data:data
    }
  }
}