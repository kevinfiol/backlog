// error middleware
// depends on middleware/render
// depends on middleware/viewData
module.exports = () => (_, res, next) => {
    res.error = error => {
        res.setViewData(
            error.message == 404
                ? { code: 404, message: 'page does not exist' }
                : { code: error.message, message: 'an error occured' }
        );

        res.render('error.ejs', res.viewData, parseInt(res.viewData.code));
    };

    next();
};