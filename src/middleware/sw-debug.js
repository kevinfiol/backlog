module.exports = () => (req, res, next) => {
    if (req.path === '/sw-debug.js') res.end();
    next();
};