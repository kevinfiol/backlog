// error middleware
// depends on middleware/render
// depends on middleware/viewData
export default () => (_, res, next) => {
    res.error = error => {
        console.error(error);
        const code = res.statusCode || 500;
        res.setViewData({ code, message: code === 404 ? 'Page not found.' : 'An internal error occured.' });
        res.render('error.ejs', res.viewData, code);
    };

    next();
};