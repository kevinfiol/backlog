import { UserService, ListService } from '../../container.js';
import typecheck from '../../util/typecheck.js';

export const user = async function(req, res) {
    try {
        const username = req.getRouteParam('username');
        typecheck({ string: username });

        // get user
        const user = await UserService.getUser({ username });
        if (user.userid === undefined) throw Error('User does not exist.');

        // get lists
        let lists = await ListService.getListsForUser({ userid: user.userid });

        const isAuth = req.session.username === user.username && req.session.userid === user.userid;

        typecheck({ object: user, array: lists, boolean: isAuth });
        res.setViewData({ user, lists, isAuth });
        res.render('user.ejs', res.viewData);
    } catch(e) {
        res.statusCode = 404;
        res.error(e);
    }
};

export const reviews = async function(req, res) {
    try {
        const username = req.getRouteParam('username');
        typecheck({ string: username });

        // get user
        const user = await UserService.getUser({ username });
        if (user.userid === undefined) throw Error('User does not exist.');

        // get reviews
        let reviews = await UserService.getReviews(user.userid);
        const isAuth = req.session.username === user.username && req.session.userid === user.userid;

        typecheck({ object: user, array: reviews, boolean: isAuth });
        res.setViewData({ user, reviews, isAuth });
        res.render('reviews.ejs', res.viewData);
    } catch(e) {
        res.statusCode = 404;
        res.error(e);
    }
};

export const createList = async function(req, res) {
    try {
        if (req.method === 'POST') {
            const { listname } = req.body;
            const { username, userid } = req.session;
            typecheck({ string: username, number: userid });

            if (username.trim().length < 1)
                throw Error('User not logged in.');

            const validation = await validateCreateList(userid, listname);

            if (!validation.ok) {
                res.setViewData({ error: validation.error });
            } else {
                const result = await ListService.addList({ listname, userid });
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

export const removeList = async function(req, res) {
    const username = req.getRouteParam('username');
    const listid = parseInt(req.getRouteParam('listid'));
    typecheck({ string: username, number: listid });

    try {
        if (req.method === 'POST') {
            const validation = await validateRemoveList(req.session.userid, listid);

            if (!validation.ok) {
                res.setViewData({ error: validation.error })
            } else {
                const result = await ListService.removeList({ listid });
                res.redirect(`/${username}`);
                return;
            }
        } else if (req.method === 'GET') {
            if (req.session.username !== username) {
                res.redirect('/');
                return;
            }

            // get list data
            const list = await ListService.getList({ listid });
            if (list.listid === undefined) throw Error('List does not exist.');

            res.setViewData({ listname: list.listname, slug: list.slug, listid: list.listid });
        }

        res.render('removeList.ejs', res.viewData);
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
        const rows = await ListService.getListBySlugAndUsername({ slug: listSlug, username });
        if (rows.length < 1) throw Error('List does not exist.')
        const listData = rows[0];

        // retrieve sections + items
        const list = await ListService.getFullList({ listid: listData.listid });

        // check if user is authed to modify list
        const isAuth = (req.session.username === username && req.session.userid === list.userid);

        typecheck({ object: list, string: username, boolean: isAuth });
        res.setViewData({ list, username, isAuth });
        res.render('list.ejs', res.viewData);
    } catch(e) {
        res.statusCode = 404;
        res.error(e);
    }
};

async function validateCreateList(userid, listname) {
    const validation = { ok: true, error: '' };

    if (listname.trim().length < 1) {
        validation.ok = false;
        validation.error = 'listname cannot be empty.'
        return validation;
    }

    const list = await ListService.getList({ userid, listname });
    if (list.listid !== undefined) {
        validation.ok = false;
        validation.error = 'a list with given name already exists on this account.'
    }

    return validation;
}

async function validateRemoveList(userid, listid) {
    const validation = { ok: true, error: '' };

    if (typeof userid !== 'number' || typeof listid !== 'number') {
        validation.ok = false;
        validation.error = 'invalid userid or listid';
        return validation;
    }

    // make sure the list even belongs to this user
    const list = await ListService.getList({ userid, listid });
    if (list.listid === undefined || list.listid !== listid) {
        validation.ok = false;
        validation.error = 'list does not belong to logged in user';
    }

    return validation;
}