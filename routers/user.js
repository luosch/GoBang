const Router = require('koa-router')
const User = require('../models/models').User;

let router = Router({
  'prefix': '/user' 
});

router.post('/login', async (ctx, next) => {
  let userId = ctx.request.body['userId'] || ''
  let password = ctx.request.body['password'] || ''

  if (userId && password) {
    let users = await User.findAll({ 
      where: { 
        userId: userId,
        password: password
      }
    });

    if (users.length > 0) {
      ctx.body = {
        'status': 'success',
        'message': '登录成功'
      }

      ctx.session.userInfo = {
        'userId': userId
      }
    } else {
      ctx.body = {
        'status': 'fail',
        'message': '登录失败'
      }
    }
  } else {
    ctx.body = {
      'status': 'fail',
      'message': '登录失败'
    }
  }
});

router.post('/logout', async (ctx, next) => {
  ctx.session = null;

  ctx.body = {
    'status': 'success',
    'message': '操作成功'
  }
});

router.post('/add', async (ctx, next) => {
  let userId = ctx.request.body['userId'] || ''
  let password = ctx.request.body['password'] || ''
  let date = new Date()

  if (userId && password) {
    let users = await User.findAll()
    if (users.length > 0) {
      ctx.body = {
        'status': 'fail',
        'message': '操作失败'
      }
    } else {
      await User.create({
        'userId': userId,
        'password': password,
        'createAt': date,
        'updateAt': date,
      })
      ctx.body = {
        'status': 'success',
        'message': '已成功添加新用户'
      }
    }
  } else {
    ctx.body = {
      'status': 'fail',
      'message': '操作失败'
    }
  }
});

module.exports = router;