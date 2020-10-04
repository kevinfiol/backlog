const cookie = require('cookie');

// adds cookie setter
module.exports = () => (_, res, next) => {
    res.setCookie = (name, value, options) => {
        res.setHeader('Set-Cookie', cookie.serialize(name, value, options));
    };

    next();
};