const { UserService } = require('../../container.js');

exports.index = async function(req, res) {
    res.render('index.ejs', res.viewData);
};

exports.login = async function(req, res) {
    if (req.method === 'POST') {
        let { username, password } = req.body;
        username = username.trim();
        password = password.trim();

        // validate
        let error = await validateLogin({ username, password });

        if (error) {
            res.render('login.ejs', { error });
        } else {
            req.session.username = username;
            res.redirect(`/${username}`);
        }
    } else {
        // check if user is already logged in
        if (req.session.username !== undefined)
            res.redirect('/');
        else
            res.render('login.ejs');
    }
};

exports.logout = async function(req, res) {
    if (req.session.username !== undefined) {
        // destroy session & clear session id cookie
        req.session.destroy();
        res.setCookie('connect.sid', '', { expires: 0 });
        res.render('logout.ejs');
    } else {
        res.redirect('/');
    }
}

exports.signup = async function(req, res) {
    if (req.method === 'POST') {
        let { username, password, confirm_password } = req.body;
        username = username.trim();
        password = password.trim();
        confirm_password = confirm_password.trim();

        // validate
        let error = await validateSignup({ username, password, confirm_password });

        if (error) {
            res.render('signup.ejs', { error });
        } else {
            await UserService.createUser({ username, password });
            req.session.username = username;
            res.redirect(`/${username}`);
        }
    } else {
        // check if user is already logged in
        if (req.session.username !== undefined)
            res.redirect('/');
        else
            res.render('signup.ejs');
    }
};

async function validateLogin({ username, password }) {
    // validate fields are filled
    if (anyEmpty([username, password]))
        return 'must provide username & password';

    // validate username & password
    const user = await UserService.validateAndGetUser({ username, password });

    if (!user)
        return 'invalid username & password combination';

    // no errors
    return null;
}

async function validateSignup({ username, password, confirm_password }) {
    // validate fields are filled
    if (anyEmpty([username, password, confirm_password]))
        return 'must provide username, password, & confirmation';

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
        'favicon.png'
    ];

    if (reservedWords.includes(username))
        return 'that username is reserved.';

    // disallow special characters
    const disallowedChars = [
        '#', '.', '/', '\\',
        '@', ';', "'", '~', '*',
        '&', '?', '%', ',',
        '<', '>', '!', ':', '(', ')'
    ];

    if (username.includes(...disallowedChars))
        return `username cannot contain special characters: ${ disallowedChars.join(' ') }`;

    // validate lengths
    if (username.length > 30)
        return 'username must be 30 characters or less';
    if (password.length < 8)
        return 'password must be at least 8 characters';
    if (password !== confirm_password)
        return 'passwords must match.';

    // check if user does not already exist
    const user = await UserService.getUser({ username });
    if (user)
        return 'user with given username already exists.';

    // no errors
    return null;
}

function anyEmpty(strs) {
    return !strs.every(s => s.trim().length >= 1);
}