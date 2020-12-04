// route param helper
export default () => (req, res, next) => {
    req.getRouteParam = key => {
        return req.params[key] ? req.params[key].trim() : '';
    };

    next();
};