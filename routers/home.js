const Router = require('koa-router');

let router = Router();

router.get('/', async (ctx, next) => {
  await ctx.render('game');
});

router.get('/help', async (ctx, next) => {
  await ctx.render('help');
});

module.exports = router;