// route param helper
module.exports = () => (req, res, next) => {
    req.getRouteParam = key => {
        return req.params[key] ? req.params[key].trim() : '';
    };

    next();
};