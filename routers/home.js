const Router = require('koa-router');
const Game = require('../models/models').Game;
let router = Router();

router.get('/', async (ctx, next) => {
  await ctx.render('home');
});

router.get('/invate', async (ctx, next) => {
  if (ctx.query.userId) {
    let games = await Game.findAll({ 
      where: { 
        blackId: ctx.query.userId
      }
    });

    if (games.length >= 1) {
      await ctx.render('invate', {
        game: games[0]
      });
      return;
    }
  }

  ctx.body = 'not found';
});

router.get('/join', async (ctx, next) => {
  if (ctx.query.gameId) {
    let games = await Game.findAll({ 
      where: { 
        gameId: ctx.query.gameId
      }
    });

    if (games.length >= 1) {
      await ctx.render('join', {
        game: games[0]
      });
      return;
    }
  }

  ctx.body = 'not found';
});

router.get('/match/:id', async (ctx, next) => {
  if (ctx.params.id) {
    let games = await Game.findAll({ 
      where: { 
        gameId: ctx.params.id
      }
    });
    await ctx.render('match', {
      game: games[0]
    });
    return
  }

  ctx.body = 'not found';
});

module.exports = router;