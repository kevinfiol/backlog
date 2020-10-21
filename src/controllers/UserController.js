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
        user = { userid: user.userid, username: user.username };

        // get lists
        let lists = await ListService.getListsForUser({ userid: user.userid });

        viewData = { ...viewData, user, lists };
        res.render('dashboard.ejs', viewData);
    } catch(e) {
        viewData = e.message == 404
            ? { ...viewData, code: 404, error: 'page does not exist' }
            : { ...viewData, code: 500, error: 'an error occured' }
        ;

        res.render('error.ejs', viewData, viewData.code);
    }
};