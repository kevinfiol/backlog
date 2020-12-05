import { UserService, ListService } from '../../container.js';
import validate from '../../util/validate.js';

export const user = async function(req, res) {
    const username = req.getRouteParam('username');

    try {
        const typecheck = validate({ username: 'tString' }, { username });
        if (!typecheck.ok) throw typecheck.errors;

        // get user
        let user = await UserService.getUser({ username });
        if (!user) throw Error('User does not exist.');
        user = { userid: user.userid, username: user.username };

        // get lists
        let lists = await ListService.getListsForUser({ userid: user.userid });

        res.setViewData({ user, lists });
        res.render('dashboard.ejs', res.viewData);
    } catch(e) {
        res.statusCode = 404;
        res.error(e);
    }
};

export const list = async function(req, res) {
    // route params
    const username = req.getRouteParam('username');
    const listSlug = req.getRouteParam('listSlug');

    try {
        const typecheck = validate(
            { username: 'tString', listSlug: 'tString' },
            { username, listSlug }
        );

        if (!typecheck.ok) throw typecheck.errors;

        // get list if it exists
        const rows = await ListService.getListBySlug({ slug: listSlug, username });
        if (rows.length < 1) throw Error('List does not exist.')
        const listData = rows[0];

        // retrieve sections + items
        const list = await ListService.getFullList({ listid: listData.listid });

        res.setViewData({ list, username });
        res.render('list.ejs', res.viewData);
    } catch(e) {
        res.statusCode = 404;
        res.error(e);
    }
}