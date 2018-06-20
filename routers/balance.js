const Router = require('koa-router')

let router = Router({
  'prefix': '/balance' 
});

router.get('/', async (ctx, next) => {
  await ctx.render('balance', {
    'walletAddress': ctx.session.walletAddress
  });
});

module.exports = router;