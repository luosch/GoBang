const Router = require('koa-router');
const Game = require('../models/models').Game;

const Nebulas = require("nebulas");
const Neb = Nebulas.Neb;
const neb = new Neb();
neb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));


let router = Router();

router.get('/', async (ctx, next) => {
   neb.api.getAccountState("n1bCyxrgedZ9BG9NEnmLSYpcvYzofrhMsjE").then(function (state) {
     console.log(state);
 }).catch(function (err) {
     console.log(err);
 });
 
  let blackGames = await Game.findAll({ 
    where: { 
      blackId: ctx.session.userId,
      status: [1, 2]
    }
  });

  if (blackGames.length > 0) {
    await ctx.render('home', {
      game: blackGames[0]
    });
    return;
  }

  let whiteGames = await Game.findAll({ 
    where: { 
      whiteId: ctx.session.userId,
      status: [1, 2]
    }
  });

  if (whiteGames.length > 0) {
    await ctx.render('home', {
      game: whiteGames[0]
    });
    return;
  }

  await ctx.render('home', {
    game: null
  });
});

router.get('/invate', async (ctx, next) => {
  if (ctx.query.userId) {
    let games = await Game.findAll({ 
      where: { 
        blackId: ctx.query.userId,
        status: [1, 2]
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
        gameId: ctx.query.gameId,
        status: [1, 2]
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

    if (games.length > 0 && ctx.session.userId) {
      await ctx.render('match', {
        game: games[0],
        userId: ctx.session.userId
      });
      return;
    }
  }

  ctx.body = 'not found';
});

module.exports = router;