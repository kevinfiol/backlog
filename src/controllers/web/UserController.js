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

export const createList = async function(req, res) {
    try {
        if (req.method === 'POST') {
            const { listname } = req.body;
            const username = req.session.username;
            if (!username || username.trim().length < 1)
                throw Error('User not logged in.');

            const validation = await validateCreateList(username, listname);

            if (!validation.ok) {
                res.setViewData({ error: validation.error });
            } else {
                const user = await UserService.getUser({ username });
                if (!user) throw Error('User does not exist!'); // just to be safe :)

                const result = await ListService.addList({ listname, userid: user.userid });
                res.redirect(`/${username}`);
                return;
            }
        } else if (req.method === 'GET') {
            const username = req.getRouteParam('username');
            typecheck({ string: username });

            if (req.session.username !== username) {
                res.redirect('/');
                return;
            }
        }

        res.render('createList.ejs', res.viewData);
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
        typecheck({ strings: [username, listSlug] });

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
};

async function validateCreateList(username, listname) {
    const valid = { ok: true, error: '' };

    if (username.trim().length < 1 || listname.trim().length < 1) {
        valid.ok = false;
        valid.error = 'listname cannot be empty.'
    }

    const lists = await ListService.getListByListnameAndUsername({ username, listname });

    if (lists.length > 0) {
        valid.ok = false;
        valid.error = 'a list with given name already exists on this account.'
    }

    return valid;
}