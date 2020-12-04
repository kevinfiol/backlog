import send from '@polka/send';

// @polka/send HTTP Response Helper
export default () => (_, res, next) => {
    res.send = send.bind(null, res);
    next();
};