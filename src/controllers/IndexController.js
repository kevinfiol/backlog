const { AuthService } = require('../container.js');

exports.index = async function(req, res) {
    const sessionUser = { username: req.session.username };
    res.render('index.ejs', { sessionUser });
};

exports.login = async function(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        // validate
        let error = await validateLogin({ username, password });

        if (error) {
            res.render('login.ejs', { error });
        } else {
            req.session.username = username.trim();
            res.redirect(`/${username.trim()}`);
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
        const { username, password, confirm_password } = req.body;

        // validate
        let error = await validateSignup({ username, password, confirm_password });

        if (error) {
            res.render('signup.ejs', { error });
        } else {
            await AuthService.createUser({ username, password });
            req.session.username = username.trim();
            res.redirect(`/${username.trim()}`);
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
    username = username.trim();
    password = password.trim();

    // validate fields are filled
    if (anyEmpty([username, password]))
        return 'must provide username & password';

    // validate username & password
    const user = await AuthService.validateAndGetUser({
        username: username,
        password: password
    });

    if (!user)
        return 'invalid username & password combination';

    // no errors
    return null;
}

async function validateSignup({ username, password, confirm_password }) {
    username = username.trim();

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
    if (password.trim() !== confirm_password.trim())
        return 'passwords must match.';

    // check if user does not already exist
    const user = await AuthService.getUser({ username: username });
    if (user)
        return 'user with given username already exists.';

    // no errors
    return null;
}

function anyEmpty(strs) {
    return !strs.every(s => s.trim().length >= 1);
}