const polka = require('polka');
const { join } = require('path');

// middleware
const sirv = require('sirv');
const compress = require('compression');
const helmet = require('helmet');
const { urlencoded } = require('@polka/parse');
const redirect = require('./middleware/redirect.js');
const session = require('./middleware/session.js');
const send = require('./middleware/send.js');
const yeahjs = require('./middleware/yeahjs.js');
const cookie = require('./middleware/cookie.js');

const STATIC_ASSETS_MAX_AGE = 31536000;

// static assets
const assets = sirv(join(__dirname, 'static'), {
    maxAge: STATIC_ASSETS_MAX_AGE,
    immutable: true
});

// app + middleware
const app = polka()
    .use(urlencoded())
    .use(redirect())
    .use(session())
    .use(compress(), assets)
    .use(helmet())
    .use(send())
    .use(yeahjs())
    .use(cookie())
;

// routes
const routes = require('./routes.js');
app.use('/', routes);

module.exports = app;