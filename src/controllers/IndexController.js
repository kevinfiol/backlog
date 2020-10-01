const { AuthService } = require('../container.js');

exports.index = async function(_, res) {
    res.render('index.ejs');
};

exports.login = async function(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        // validate
        let msg = await validateLogin({ username, password });

        if (msg) {
            res.render('login.ejs', { error: msg });
        } else {
            res.redirect('/');
        }
    } else {
        console.log(req.session);
        res.render('login.ejs');
    }
};

exports.signup = async function(req, res) {
    if (req.method === 'POST') {
        const { username, password, confirm_password } = req.body;

        // validate
        let msg = await validateSignup({ username, password, confirm_password });

        if (msg) {
            res.render('signup.ejs', { error: msg });
        } else {
            await AuthService.createUser({ username, password });
            res.redirect('/');
        }
    } else {
        console.log(req.session);
        res.render('signup.ejs');
    }
};

async function validateLogin({ username, password }) {
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
    // validate fields are filled
    if (anyEmpty([username, password, confirm_password]))
        return 'must provide username, password, & confirmation';

    // validate lengths
    if (username.trim().length > 30)
        return 'username must be 30 characters or less';
    if (password.trim().length < 8)
        return 'password must be at least 8 characters';
    if (password.trim() !== confirm_password.trim())
        return 'passwords must match.';

    // check if user does not already exist
    const user = await AuthService.getUser({ username: username.trim() });
    if (user)
        return 'user with given username already exists.';

    // no errors
    return null;
}

function anyEmpty(strs) {
    return !strs.every(s => s.trim().length >= 1);
}