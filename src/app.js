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
const render = require('./middleware/render.js');
const setCookie = require('./middleware/setCookie.js');
const swDebug = require('./middleware/sw-debug.js');
const error = require('./middleware/error.js');
const getRouteParam = require('./middleware/getRouteParam.js');

const STATIC_ASSETS_MAX_AGE = 31536000;

// static assets
const assets = sirv(join(__dirname, 'static'), {
    maxAge: STATIC_ASSETS_MAX_AGE,
    immutable: true
});

// app + middleware
const app = polka().use(
    urlencoded(),
    redirect(),
    session(),
    compress(), assets,
    helmet(),
    send(),
    getRouteParam(),
    render(),
    setCookie(),
    error(),
    swDebug(),
);

// routes
app.use('/', require('./routes.js'));

module.exports = app;