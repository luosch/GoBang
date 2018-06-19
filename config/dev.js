module.exports = {
  port: 8080,
  
  db: {
    host: '127.0.0.1',
    database: 'GoBang',
    username: 'root',
    password: '123456',
    dialect: 'mysql',
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};