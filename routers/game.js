const Router = require('koa-router');
const Game = require('../models/models').Game;
const md5 = require("blueimp-md5");

let router = Router({
  'prefix': '/game' 
});

// 创建游戏
router.post('/add', async (ctx, next) => {
  let gameId = ctx.request.body['gameId'] || '';
  let blackId = ctx.request.body['blackId'] || '';
  let blackNickName = ctx.request.body['blackNickName'] || '';
  let blackBet = ctx.request.body['blackBet'] || '';
  blackBet = parseFloat(blackBet);

  await Game.create({
    'gameId': gameId,
    'blackId': blackId,
    'blackNickName': blackNickName,
    'blackBet': blackBet,
    'status': 1
  })

  ctx.session.walletAddress = blackId
  
  ctx.body = {
    'status': 'success',
    'message': '创建成功'
  }
});

// 游戏页面
router.get('/match/:id', async (ctx, next) => {
  // let userId = ctx.request.body['userId'] || ''
  // let password = ctx.request.body['password'] || ''

  console.log("ctx.request.body", ctx.request.body);
  ctx.body = {
    'status': 'fail',
    'message': '操作失败'
  }
});

// 加入游戏
router.post('/join', async (ctx, next) => {
  console.log("ctx.request.body", ctx.request.body);
  let gameId = ctx.request.body['gameId'] || '';
  let whiteId = ctx.request.body['whiteId'] || '';
  let whiteNickName = ctx.request.body['whiteNickName'] || '';
  let whiteBet = ctx.request.body['whiteBet'] || '';

  let games = await Game.findAll({ 
    where: { 
      gameId: gameId
    }
  });

  if (games.length > 0) {
    let game = games[0]

    await game.update({
      'whiteId': whiteId,
      'whiteNickName': whiteNickName,
      'whiteBet': whiteBet,
      'status': 2,
      'updateAt': new Date()
    })

    ctx.body = {
      'status': 'success',
      'message': '加入成功'
    }
    return;
  }

  ctx.body = {
    'status': 'success',
    'message': '操作失败'
  }
});

module.exports = router;