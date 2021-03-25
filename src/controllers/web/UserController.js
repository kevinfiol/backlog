import { UserService, ListService, ItemService } from '../../container.js';
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

export const createReview = async function(req, res) {
    try {
        if (req.method === 'POST') {
            const { reviewname, reviewtext } = req.body;
            const { username, userid } = req.session;
            typecheck({ strings: [reviewname, reviewtext, username], number: userid });

            if (username.trim().length < 1)
                throw Error('User not logged in.');

            const validation = validateCreateReview(reviewname, reviewtext);

            if (!validation.ok) {
                res.setViewData({ error: validation.error });
            } else {
                const result = await UserService.addReview({ reviewname, reviewtext, userid });
                res.redirect(`/${username}/reviews`);
                return;
            }
        } else if (req.method === 'GET') {
            const username = req.getRouteParam('username');
            const { userid } = req.session;
            typecheck({ string: username });

            res.setViewData({ reviewIsEditing: false });

            if (req.session.username !== username) {
                res.redirect('/');
                return;
            } else {
                // get list of items for etto autocomplete
                let itemnames = await ItemService.getItemsByUserid({ userid });
                itemnames = itemnames.map((name) => ({ label: name }));
                res.setViewData({ payload: { itemnames } })
            }
        }

        res.render('editReview.ejs', res.viewData);
    } catch(e) {
        res.statusCode = 404;
        res.error(e);
    }
};

export const editReview = async function(req, res) {
    try {
        if (req.method === 'POST') {
            let reviewid = req.getRouteParam('reviewid');
            reviewid = parseInt(reviewid);

            const { reviewname, reviewtext } = req.body;
            const { username, userid } = req.session;
            typecheck({ strings: [reviewname, reviewtext, username], numbers: [userid, reviewid] });

            if (username.trim().length < 1)
                throw Error('User not logged in.');

            const validation = await validateEditReview(userid, { reviewid, reviewname, reviewtext });

            if (!validation.ok) {
                res.setViewData({ error: validation.error });
            } else {
                const result = await UserService.editReview({ reviewid, reviewname, reviewtext });
                res.redirect(`/${username}/reviews`);
                return;
            }
        } else if (req.method === 'GET') {
            const username = req.getRouteParam('username');
            let reviewid = req.getRouteParam('reviewid');
            reviewid = parseInt(reviewid);
            const { userid } = req.session;
            typecheck({ string: username, number: reviewid });

            res.setViewData({ reviewIsEditing: true });

            if (req.session.username !== username) {
                res.redirect('/');
                return;
            } else {
                let [itemnames, review] = await Promise.all([
                    ItemService.getItemsByUserid({ userid }),
                    UserService.getReview({ reviewid })
                ]);

                itemnames = itemnames.map((name) => ({ label: name }));
                res.setViewData({ reviewid, payload: { itemnames, review } });
            }
        }

        res.render('editReview.ejs', res.viewData);
    } catch (e) {
        res.statusCode = 404;
        res.error(e);
    }
};

export const removeReview = async function(req, res) {
    const username = req.getRouteParam('username');
    const reviewid = parseInt(req.getRouteParam('reviewid'));
    typecheck({ string: username, number: reviewid });

    try {
        if (req.method === 'POST') {
            const { userid } = req.session;
            const validation = await validateRemoveReview(userid, reviewid);

            if (!validation.ok) {
                res.setViewData({ error: validation.error })
            } else {
                const result = await UserService.removeReview({ reviewid });
                res.redirect(`/${username}/reviews`);
                return;
            }
        } else if (req.method === 'GET') {
            if (req.session.username !== username)  {
                res.redirect('/');
                return;
            }

            // get list data
            const review = await UserService.getReview({ reviewid });
            if (review.reviewid === undefined) throw Error('Review does not exist.');

            res.setViewData({ reviewname: review.reviewname, reviewid: review.reviewid });
        }

        res.render('removeReview.ejs', res.viewData);
    } catch(e) {
        res.statusCode = 404;
        res.error(e);
    }
};

async function validateCreateList(userid, listname) {
    const validation = { ok: true, error: '' };

    if (listname.trim().toUpperCase() == 'REVIEWS') {
        validation.ok = false;
        validation.error = 'listname cannot be "reviews"';
        return validation;
    }

    if (listname.trim().length < 1) {
        validation.ok = false;
        validation.error = 'listname cannot be empty.';
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

function validateCreateReview(reviewname, reviewtext) {
    const validation = { ok: true, error: '' };

    if (!reviewname.trim() || !reviewtext.trim()) {
        validation.ok = false;
        validation.error = 'please provide a review name & review text';
        return validation;
    }

    return validation;
}

async function validateEditReview(userid, { reviewid, reviewname, reviewtext }) {
    const validation = { ok: true, error: '' };

    if (typeof userid !== 'number' || typeof reviewid !== 'number') {
        validation.ok = false;
        validation.error = 'invalid userid or reviewid';
        return validation;
    }

    if (!reviewname.trim() || !reviewtext.trim()) {
        validation.ok = false;
        validation.error = 'please provide a review name & review text';
        return validation;
    }

    // make sure review belongs to user
    const review = await UserService.getReview({ userid, reviewid });
    if (review.reviewid === undefined || review.reviewid !== reviewid) {
        validation.ok = false;
        validation.error = 'review does not belong to logged in user';
    }

    return validation;
}

async function validateRemoveReview(userid, reviewid) {
    const validation = { ok: true, error: '' };

    if (typeof userid !== 'number' || typeof reviewid !== 'number') {
        validation.ok = false;
        validation.error = 'invalid userid or reviewid';
        return validation;
    }

    // make sure review belongs to user
    const review = await UserService.getReview({ userid, reviewid });
    if (review.reviewid === undefined || review.reviewid !== reviewid) {
        validation.ok = false;
        validation.error = 'review does not belong to logged in user';
    }

    return validation;
}