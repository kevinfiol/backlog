import { UserService } from '../../container.js';
import typecheck from '../../util/typecheck.js';

export const index = async function(req, res) {
    res.render('index.ejs', res.viewData);
};

export const login = async function(req, res) {
    if (req.method === 'POST') {
        let { username, password, phone } = req.body;
        typecheck({ strings: [username, password, phone] });

        username = username.trim();
        password = password.trim()
        phone = phone.trim(); // this variable is a honeypot; this SHOULD be an empty string

        let validation = await validateLogin({ username, password, phone });
        if (validation.ok) {
            req.session.username = validation.data.user.username;
            req.session.userid = validation.data.user.userid;
            res.redirect(`/${username}`);
        } else {
            res.render('login.ejs', { error: validation.error });
        }
    } else {
        // check if user is already logged in
        if (req.session.username !== undefined)
            res.redirect('/');
        else
            res.render('login.ejs');
    }
};

export const logout = async function(req, res) {
    if (req.session.username !== undefined && req.session.userid !== undefined) {
        // destroy session & clear session id cookie
        req.session.destroy();
        res.setCookie('connect.sid', '', { expires: 0 });
        res.clearSessionCookie();
        res.render('logout.ejs');
    } else {
        res.redirect('/');
    }
}

export const signup = async function(req, res) {
    if (req.method === 'POST') {
        let { username, password, confirm_password, phone } = req.body;
        typecheck({ strings: [username, password, confirm_password, phone] });
        username = username.trim();
        password = password.trim();
        confirm_password = confirm_password.trim();
        phone = phone.trim(); // this variable is a honeypot; this SHOULD be an empty string

        const validation = await validateSignup({ username, password, confirm_password, phone });
        if (validation.ok) {
            const result = await UserService.createUser({ username, password });
            req.session.username = username;
            req.session.userid = result.lastID;
            res.redirect(`/${username}`);
        } else {
            res.render('signup.ejs', { error: validation.error });
        }
    } else {
        // check if user is already logged in
        if (req.session.username !== undefined && req.session.userid !== undefined)
            res.redirect('/');
        else
            res.render('signup.ejs');
    }
};

async function validateLogin({ username, password, phone }) {
    const validation = { ok: true, error: '', data: {} };

    // honeypot
    if (phone.length > 1) {
        validation.ok = false;
        validation.error = 'unable to login';
        return validation;
    }

    // validate fields are filled
    if (anyEmpty([username, password])) {
        validation.ok = false;
        validation.error = 'must provide username & password';
        return validation;
    }

    // validate username & password
    const user = await UserService.validateAndGetUser({ username, password });

    if (user.userid === undefined) {
        validation.ok = false;
        validation.error = 'invalid username & password combination';
        return validation;
    } else {
        validation.data.user = user;
    }

    return validation;
}

async function validateSignup({ username, password, confirm_password, phone }) {
    const validation = { ok: true, error: '', data: {} };

    // honeypot
    if (phone.length > 1) {
        validation.ok = false;
        validation.error = 'unable to sign up';
        return validation;
    }

    // validate fields are filled
    if (anyEmpty([username, password, confirm_password])) {
        validation.ok = false;
        validation.error = 'must provide username, password, & confirmation';
        return validation;
    }

    // reserved words
    const reservedWords = [
        'login',
        'signup',
        'logout',
        'settings',
        'config',
        'home',
        'dashboard',
        'about',
        'favicon.ico',
        'favicon.png',
        'list',
        'api'
    ];

    if (reservedWords.includes(username)) {
        validation.ok = false;
        validation.error = 'that username is reserved.';
        return validation;
    }

    // disallow special characters
    const disallowedChars = [
        '#', '.', '/', '\\',
        '@', ';', "'", '~', '*',
        '&', '?', '%', ',',
        '<', '>', '!', ':', '(', ')'
    ];

    if (username.includes(...disallowedChars)) {
        validation.ok = false;
        validation.error = `username cannot contain special characters: ${ disallowedChars.join(' ') }`;
        return validation;
    }

    // validate lengths
    if (username.length > 30) {
        validation.ok = false;
        validation.error = 'username must be 30 characters or less';
        return validation;
    }

    if (password.length < 8) {
        validation.ok = false;
        validation.error = 'password must be at least 8 characters';
        return validation;
    }

    if (password !== confirm_password) {
        validation.ok = false;
        validation.error = 'passwords must match.';
        return validation;
    }

    // check if user does not already exist
    const user = await UserService.getUser({ username });
    if (user.userid !== undefined && user.username !== undefined) {
        validation.ok = false;
        validation.error = 'user with given username already exists.'
        return validation;
    }

    return validation;
}

function anyEmpty(strs) {
    return !strs.every(s => s.trim().length >= 1);
}