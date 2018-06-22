const Router = require('koa-router')

let router = Router({
  'prefix': '/wallet' 
});

router.get('/', async (ctx, next) => {
  await ctx.render('wallet', {
    'walletAddress': ctx.session.walletAddress
  });
});

router.post('/login', async (ctx, next) => {
  let walletAddress = ctx.request.body['walletAddress'] || ''
  console.log('walletAddress', walletAddress)
  ctx.session.walletAddress = walletAddress
  ctx.body = {
    'status': 'success',
    'message': '登录成功'
  }
});

router.post('/logout', async (ctx, next) => {
  ctx.session = null;

  ctx.body = {
    'status': 'success',
    'message': '注销成功'
  }
});

module.exports = router;