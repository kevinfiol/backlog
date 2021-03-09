import polka from 'polka';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// middleware
import sirv from 'sirv';
import compress from 'compression';
import helmet from 'helmet';
import { urlencoded, json } from '@polka/parse';
import redirect from './middleware/redirect.js';
import session from './middleware/session.js';
import send from './middleware/send.js';
import render from './middleware/render.js';
import setCookie from './middleware/setCookie.js';
import swDebug from './middleware/sw-debug.js';
import error from './middleware/error.js';
import getRouteParam from './middleware/getRouteParam.js';
import viewData from './middleware/viewData.js';
import csp from './middleware/csp.js';
import logger from './middleware/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATIC_ASSETS_MAX_AGE = 31536000;

const polkaOpts = {
    onError(err, req, res, next) {
        if (err.code == 'ECONNRESET') next();
    }
};

// static assets
const assets = sirv(join(__dirname, 'static'), {
    maxAge: STATIC_ASSETS_MAX_AGE,
    immutable: true,
    dev: true
});

// app + middleware
const app = polka(polkaOpts).use(
    // helpers
    logger(),
    urlencoded(),
    json(),
    session(),
    compress(), assets,

    // custom helpers
    redirect(),
    render(),
    send(),
    getRouteParam(),
    setCookie(),
    viewData(),
    error(),
    swDebug(),

    // csp / security
    helmet(),
    csp(),
);

// router
import router from './router.js';
app.use('/', router);

export default app;