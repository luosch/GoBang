const Router = require('koa-router')

let router = Router({
  'prefix': '/wallet' 
});

router.get('/', async (ctx, next) => {
  await ctx.render('wallet', {
    'walletAddress': ctx.session.walletAddress
  });
});

router.post('/setAddress', async (ctx, next) => {
  let walletAddress = ctx.request.body['walletAddress'] || ''
  console.log('walletAddress', walletAddress)
  ctx.session.walletAddress = walletAddress
  ctx.body = {
    'status': 'success',
    'message': '操作成功'
  }
});

module.exports = router;