const { AuthService } = require('../container.js');

exports.user = async function(req, res) {
    const username = req.params.username || '';
    let user;

    try {
        user = await AuthService.getUser({ username: username.trim() });
    } catch(e) {
        res.render('error.ejs', { error: 'an error occurred.' }, 500);
    }

    if (!user)
        res.redirect('/'); // TODO: probably should direct to 404 page instead
    user = { username: user.username };

    res.render('dashboard.ejs', { user });
};