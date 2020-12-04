// halt sw-debug requests
export default () => (req, res, next) => {
    if (req.path === '/sw-debug.js')
        res.end();
    else
        next();
};