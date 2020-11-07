// error middleware
// depends on middleware/render
module.exports = () => (_, res, next) => {
    res.error = (error, viewData) => {
        viewData = error.message == 404
            ? { ...viewData, code: 404, message: 'page does not exist' }
            : { ...viewData, code: error.message, message: 'an error occured' }
        ;

        res.render('error.ejs', viewData, parseInt(viewData.code));
    };

    next();
};