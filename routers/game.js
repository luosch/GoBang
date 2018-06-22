const Router = require('koa-router')

let router = Router({
  'prefix': '/game' 
});

router.get('/', async (ctx, next) => {
  await ctx.render('game', {
    'walletAddress': ctx.session.walletAddress
  });
});

router.get('/match/:id', async (ctx, next) => {
  // let userId = ctx.request.body['userId'] || ''
  // let password = ctx.request.body['password'] || ''

  console.log("ctx.request.body", ctx.request.body);
  ctx.body = {
    'status': 'fail',
    'message': '操作失败'
  }
});

router.post('/add', async (ctx, next) => {
  // let userId = ctx.request.body['userId'] || ''
  // let password = ctx.request.body['password'] || ''

  console.log("ctx.request.body", ctx.request.body);
  ctx.body = {
    'status': 'fail',
    'message': '操作失败'
  }
});

router.post('/add', async (ctx, next) => {
  // let userId = ctx.request.body['userId'] || ''
  // let password = ctx.request.body['password'] || ''

  console.log("ctx.request.body", ctx.request.body);
  ctx.body = {
    'status': 'fail',
    'message': '操作失败'
  }
});

module.exports = router;