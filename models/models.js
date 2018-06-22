const Sequelize = require('sequelize')
const config = require('../config/dev')

// 数据库操作实例
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: config.db.dialect,
  pool: config.db.pool,

  operatorsAliases: false
})

// 定义游戏模型
const Game = sequelize.define('Game', {
  gameId: Sequelize.STRING,
  userAId: Sequelize.STRING,
  userAMoney: Sequelize.FLOAT,
  userBId: Sequelize.STRING,
  userBMoney: Sequelize.FLOAT,
  status: Sequelize.INT,
  sequence: Sequelize.STRING,
  createAt: Sequelize.DATE,
  updateAt: Sequelize.DATE
})

Game.sync()

module.exports = {
  orm: sequelize,
  Game: Game
}