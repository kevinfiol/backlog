const polka = require('polka');
const send = require('@polka/send');
const parse = require('@polka/parse');
const helmet = require('helmet');
const eta = require('eta');
const path = require('path');

// configure template engine
eta.configure({ views: path.join(__dirname, 'views') })

// create app & add middleware
const app = polka();
app.use(helmet());
app.use(parse.json());

// custom middleware
// attach @polka/send to response objects
app.use((_, res, next) => {
    res.send = send.bind(null, res);
    next();
});

// attach eta template engine
app.use((_, res, next) => {
    res.render = async (file, data) => {
        try {
            const html = await eta.renderFile(file, data);
            res.send(200, html, { 'Content-Type': 'text/html' });
        } catch (e) {
            res.send(500, e.message || e);
        }
    };

    next();
});

// routes
const IndexRoutes = require('./routes/IndexRoutes.js');

app.use('/', IndexRoutes);

module.exports = app;