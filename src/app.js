const polka = require('polka');
const { join } = require('path');

// middleware
const sirv = require('sirv');
const compress = require('compression');
const helmet = require('helmet');
const { json } = require('@polka/parse');
const session = require('./middleware/session.js');
const send = require('./middleware/send.js');
const yeahjs = require('./middleware/yeahjs.js');

const STATIC_ASSETS_MAX_AGE = 31536000;

// static assets
const assets = sirv(join(__dirname, 'static'), {
    maxAge: STATIC_ASSETS_MAX_AGE,
    immutable: true
});

// app + middleware
const app = polka();
app.use(session());
app.use(compress(), assets);
app.use(helmet());
app.use(json());
app.use(send());
app.use(yeahjs());

// routes
const IndexRoutes = require('./routes/IndexRoutes.js');
app.use('/', IndexRoutes);

module.exports = app;