const Router = require('koa-router');
const Game = require('../models/models').Game;

// const Nebulas = require("nebulas");
// const Neb = Nebulas.Neb;
// const neb = new Neb();
// neb.setRequest(new Nebulas.HttpRequest("https://testnet.nebulas.io"));
// let Account = Nebulas.Account;
// const keystore = '{"address":"n1FSqf5h1RfACb1PDy9LaSyfHWBbcXnafm3","crypto":{"cipher":"aes-128-ctr","ciphertext":"95fa1a0d82f35bcf7db986b5341b4f41635fb59cfc26c1afb54daa643b77631b","cipherparams":{"iv":"27e48daedc63d6670e450d03e114fcd9"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":4096,"p":1,"r":8,"salt":"565a6f3d64985a997dffab7e8faade1177250d88541dcc00ff4edf85c04c887c"},"mac":"d156c12a756d19eac59e04c4230e3ab3aff425a439528f95ba5c06adc546b721","machash":"sha3256"},"id":"2cd10cb9-93fc-42f2-9ef9-7b0f57d33f86","version":4}'

let router = Router();

router.get('/', async (ctx, next) => {
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