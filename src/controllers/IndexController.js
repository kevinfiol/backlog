exports.indexAction = async function(_, res) {
    res.render('index.ejs', { foo: 5 });
};