import { UserService, ListService } from '../../container.js';
import typecheck from '../../util/typecheck.js';

export const user = async function(req, res) {
    try {
        const username = req.getRouteParam('username');
        typecheck({ string: username });

        // get user
        let user = await UserService.getUser({ username });
        if (!user) throw Error('User does not exist.');
        user = { userid: user.userid, username: user.username };

        // get lists
        let lists = await ListService.getListsForUser({ userid: user.userid });

        typecheck({ object: user, array: lists });
        res.setViewData({ user, lists });
        res.render('dashboard.ejs', res.viewData);
    } catch(e) {
        res.statusCode = 404;
        res.error(e);
    }
};

export const list = async function(req, res) {
    try {
        // route params
        const username = req.getRouteParam('username');
        const listSlug = req.getRouteParam('listSlug');
        typecheck({ string: [username, listSlug] });

        // get list if it exists
        const rows = await ListService.getListBySlug({ slug: listSlug, username });
        if (rows.length < 1) throw Error('List does not exist.')
        const listData = rows[0];

        // retrieve sections + items
        const list = await ListService.getFullList({ listid: listData.listid });

        typecheck({ object: list, string: username });
        res.setViewData({ list, username });
        res.render('list.ejs', res.viewData);
    } catch(e) {
        res.statusCode = 404;
        res.error(e);
    }
}