const { ListService } = require('../../container.js');

exports.getFullList = async function(req, res) {
    // route params
    const listid = req.getRouteParam('listid');

    try {
        // check if route param is valid
        if (!listid) throw Error(404);
    } catch(e) {
        // got to error json
        // res.error(e);
    }
};