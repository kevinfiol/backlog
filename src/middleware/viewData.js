// viewData helper
// depends on middleware/session
export default () => (req, res, next) => {
    res.viewData = {};

    res.setViewData = viewData => {
        res.viewData = { ...res.viewData, ...viewData };
    };

    // by default, set the sessionUser
    res.setViewData({ sessionUser: { username: req.session.username } });

    next();
};