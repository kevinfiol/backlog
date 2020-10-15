const { UserService } = require('../container.js');
const { ListService } = require('../container.js');

exports.user = async function(req, res) {
    // route params
    const username = req.params.username || '';

    // session
    const sessionUser = { username: req.session.username };

    // view data
    let viewData = { sessionUser };

    try {
        // get user
        let user = await UserService.getUser({ username: username.trim() });
        if (!user) throw Error(404);

        // get lists
        let lists = await ListService.getListsForUser({ userid: user.userid });

        user = { username: user.username };
        res.render('dashboard.ejs', { ...viewData, user, lists });
    } catch(e) {
        if (e.message == 404)
            res.render('error.ejs', { ...viewData, code: 404, error: 'page does not exist' }, 404);
        else
            res.render('error.ejs', { ...viewData, code: 500, error: 'an error occured' }, 500);
    }
};