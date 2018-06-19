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

// 定义用户模型
const User = sequelize.define('User', {
  userId: Sequelize.STRING,
  password: Sequelize.STRING,
  createAt: Sequelize.DATE,
  updateAt: Sequelize.DATE
})

User.sync()

// 定义游戏模型
const Game = sequelize.define('Game', {
  gameId: Sequelize.STRING,
  userAId: Sequelize.STRING,
  userBId: Sequelize.STRING,
  sequence: Sequelize.STRING,
  createAt: Sequelize.DATE,
  updateAt: Sequelize.DATE
})

Game.sync()

module.exports = {
  orm: sequelize,
  User: User,
  Game: Game
}