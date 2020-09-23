const send = require('@polka/send');

// @polka/send HTTP Response Helper
module.exports = () => (_, res, next) => {
    res.send = send.bind(null, res);
    next();
};