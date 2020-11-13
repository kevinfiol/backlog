// error middleware
// depends on middleware/render
// depends on middleware/viewData
module.exports = () => (_, res, next) => {
    res.error = error => {
        const code = res.statusCode || 500;
        res.setViewData({ code, message: error.message || error });
        res.render('error.ejs', res.viewData, code);
    };

    next();
};