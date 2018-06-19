const Router = require('koa-router');

let router = Router();

router.get('/', async (ctx, next) => {
  if (ctx.session.userInfo) {
    await ctx.render('home', {
      'userInfo': ctx.session.userInfo
    });
  } else {
    await ctx.render('home', {
      'userInfo': null
    });  
  }
});

module.exports = router;