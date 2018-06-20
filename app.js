const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const render = require('koa-ejs');
const session = require('koa-session');

const path = require('path');
const config = require('./config/dev');
const app = new Koa();

const home = require('./routers/home');
const wallet = require('./routers/wallet');
const game = require('./routers/game');
const balance = require('./routers/balance');

// logger
app.use((ctx, next) => {
    const start = new Date();
    return next().then(() => {
        const ms = new Date() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    });
});

// static
app.use(require('koa-static')(path.join(__dirname, 'static')));

// Session
app.keys = ['e1ea5111b13c6b4b010084b806abbc6a'];

const CONFIG = {
  key: 'koa:sess',
  maxAge: 3*24*3600*1000,
};

app.use(session(CONFIG, app));

// bodyParser
app.use(bodyParser());

// render
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debug: false
});

// router
app.use(home.routes(), home.allowedMethods());
app.use(wallet.routes(), wallet.allowedMethods());
app.use(game.routes(), game.allowedMethods());
app.use(balance.routes(), balance.allowedMethods());

// listen
app.listen(config.port);