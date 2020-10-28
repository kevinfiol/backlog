const { UserService } = require('../container.js');
const { ListService } = require('../container.js');

exports.user = async function(req, res) {
    // route params
    const username = req.getRouteParam('username');

    // session
    const sessionUser = { username: req.session.username };

    // view data
    let viewData = { sessionUser };

    try {
        // check if route param is valid
        if (!username) throw Error(404);

        // get user
        let user = await UserService.getUser({ username });
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

exports.list = async function(req, res) {
    // route params
    const username = req.getRouteParam('username');
    const listSlug = req.getRouteParam('listSlug');

    // session
    const sessionUser = { username: req.session.username };

    // view data
    let viewData = { sessionUser };

    try {
        if (!username || !listSlug) throw Error(404);

        // check if list exists using listSlug
        let listData = await ListService.getList({ slug: listSlug });
        if (!listData) throw Error(404);

        // retrieve items
        const items = await ListService.getItemsForList({ listid: listData.listid });
        console.log(items);
        res.render('list.ejs');
    } catch(e) {
        viewData = e.message == 404
            ? { ...viewData, code: 404, error: 'page does not exist' }
            : { ...viewData, code: 500, error: 'an error occured' }
        ;

        res.render('error.ejs', viewData, viewData.code);
    }
}