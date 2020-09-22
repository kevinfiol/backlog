exports.indexAction = async function(_, res) {
    res.render('index.eta', { foo: 5 });
};