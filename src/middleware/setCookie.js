import cookie from 'cookie';
import { sessionConfig } from '../container.js';

// adds cookie setter
export default () => (_, res, next) => {
    res.setCookie = (name, value, options) => {
        res.setHeader('Set-Cookie', cookie.serialize(name, value, options));
    };

    res.clearSessionCookie = () => {
        res.setCookie(sessionConfig.name, '');
    };

    next();
};