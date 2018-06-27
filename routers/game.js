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
  let blackBet = ctx.request.body['blackBet'] || 0;

  ctx.session.userId = blackId

  let games = await Game.findAll({ 
    where: { 
      blackId: blackId,
      status: [1, 2]
    }
  });

  if (games.length > 0) {
    ctx.body = {
      'status': 'fail',
      'message': '创建失败'
    }
    return;
  }

  await Game.create({
    'gameId': gameId,
    'blackId': blackId,
    'blackNickName': blackNickName,
    'blackBet': blackBet,
    'status': 1
  })

  ctx.body = {
    'status': 'success',
    'message': '创建成功'
  }
});

// 获取游戏顺序
router.get('/info/:id', async (ctx, next) => {
  let games = await Game.findAll({ 
    where: { 
      gameId: ctx.params.id
    }
  });

  if (games.length > 0) {
    ctx.body = games[0];
  } else {
    ctx.body = {}
  }
});

// 更新游戏顺序
router.post('/update/:id', async (ctx, next) => {
  let games = await Game.findAll({ 
    where: { 
      gameId: ctx.params.id
    }
  });

  let seq = ctx.request.body['seq'] || '';
  console.log('seq', seq);
  if (games.length > 0 && seq) {
    let game = games[0];
    await game.update({
      'sequence': seq
    })
    ctx.body = {
      'status': 'success',
      'message': '操作成功'
    }
  } else {
    ctx.body = {
      'status': 'fail',
      'message': '操作失败'
    }
  }
});

// 更新游戏顺序
router.post('/end/:id', async (ctx, next) => {
  let games = await Game.findAll({ 
    where: { 
      gameId: ctx.params.id
    }
  });

  let status = ctx.request.body['status'] || '';
  console.log('status', status);
  if (games.length > 0 && status) {
    let game = games[0];
    await game.update({
      'status': status
    })
    ctx.body = {
      'status': 'success',
      'message': '操作成功'
    }
  } else {
    ctx.body = {
      'status': 'fail',
      'message': '操作失败'
    }
  }
});

// 加入游戏
router.post('/join', async (ctx, next) => {
  console.log("ctx.request.body", ctx.request.body);
  let gameId = ctx.request.body['gameId'] || '';
  let whiteId = ctx.request.body['whiteId'] || '';
  let whiteNickName = ctx.request.body['whiteNickName'] || '';
  let whiteBet = ctx.request.body['whiteBet'] || 0;

  ctx.session.userId = whiteId

  let games = await Game.findAll({ 
    where: { 
      gameId: gameId
    }
  });

  if (games.length > 0) {
    let game = games[0]

    if (game.status != 1) {
      ctx.body = {
        'status': 'fail',
        'message': '加入失败'
      }
      return;
    }

    await game.update({
      'whiteId': whiteId,
      'whiteNickName': whiteNickName,
      'whiteBet': whiteBet,
      'status': 2
    })

    ctx.body = {
      'status': 'success',
      'message': '加入成功'
    }
    return;
  }

  ctx.body = {
    'status': 'success',
    'message': '加入失败'
  }
});

module.exports = router;