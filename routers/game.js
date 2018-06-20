const Router = require('koa-router')

let router = Router({
  'prefix': '/game' 
});


router.get('/', async (ctx, next) => {
  await ctx.render('game', {
    'walletAddress': ctx.session.walletAddress
  });
});

module.exports = router;