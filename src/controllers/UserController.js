const { UserService } = require('../container.js');
const { ListService } = require('../container.js');

exports.user = async function(req, res) {
    // route params
    const username = req.params.username || '';

    // session
    const sessionUser = { username: req.session.username };

    // view data
    let viewData = { sessionUser };

    let user;
    let lists;

    try {
        // get user
        user = await UserService.getUser({ username: username.trim() });
        // get lists
        lists = await ListService.getListsForUser({ userid: user.userid });
    } catch(e) {
        res.render('error.ejs', { ...viewData, code: 500, error: 'an error occured' }, 500);
    }

    if (!user) {
        res.render('error.ejs', { ...viewData, code: 404, error: 'page does not exist' }, 404);
    } else {
        user = { username: user.username };
        res.render('dashboard.ejs', { ...viewData, user, lists });
    }
};