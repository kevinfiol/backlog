const { AuthService } = require('../container.js');

exports.user = async function(req, res) {
    console.log('user route: ', req.params);

    // route params
    const username = req.params.username || '';

    // session
    const sessionUser = { username: req.session.username };

    // view data
    const viewData = { sessionUser };

    let user;
    try {
        user = await AuthService.getUser({ username: username.trim() });
    } catch(e) {
        res.render('error.ejs', { ...viewData, code: 500, error: 'an error occured' }, 500);
    }

    if (!user) {
        res.render('error.ejs', { ...viewData, code: 404, error: 'page does not exist' }, 404);
    } else {
        user = { username: user.username };
        res.render('dashboard.ejs', { ...viewData, user });
    }
};