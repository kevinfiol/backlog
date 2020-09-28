const SQLite = require('../services/SQLite.js');

exports.indexAction = async function(_, res) {
    let row = await SQLite.get('*', 'User');
    console.log(row);

    res.render('index.ejs', { foo: 5 });
};