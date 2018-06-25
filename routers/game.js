const Router = require('koa-router');
const Game = require('../models/models').Game;
const md5 = require("blueimp-md5");

let router = Router({
  'prefix': '/game' 
});

// 创建游戏
router.post('/add', async (ctx, next) => {
  console.log("ctx.request.body", ctx.request.body);
  let blackId = ctx.request.body['blackId'] || '';
  let blackNickName = ctx.request.body['blackNickName'] || '';
  let blackBet = ctx.request.body['blackBet'] || '';
  blackBet = parseFloat(blackBet);

  let date = new Date();

  let games = await Game.findAll();
  let gameId = md5(games.length+Date.now());

  await Game.create({
    'gameId': gameId,
    'blackId': blackId,
    'blackNickName': blackNickName,
    'blackBet': blackBet,
    'createAt': date,
    'updateAt': date,
    'status': 1
  })

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
  // let userId = ctx.request.body['userId'] || ''
  // let password = ctx.request.body['password'] || ''

  console.log("ctx.request.body", ctx.request.body);
  ctx.body = {
    'status': 'fail',
    'message': '操作失败'
  }
});

module.exports = router;