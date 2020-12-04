import cookie from 'cookie';

// adds cookie setter
export default () => (_, res, next) => {
    res.setCookie = (name, value, options) => {
        res.setHeader('Set-Cookie', cookie.serialize(name, value, options));
    };

    next();
};