const { ListService } = require('../../container.js');

exports.getFullList = async function(req, res) {
    // route params
    const listid = req.getRouteParam('listid');

    try {
        // check if route param is valid
        if (!listid) throw Error(404);
        const list = await ListService.getFullList({ listid });

        res.send(200, list);
    } catch(e) {
        res.send(e.message, { message: 'Could not get full list.' });
    }
};

exports.addItem = async function(req, res) {
    let { listid, sectionid, itemPosition, item } = req.body;

    try {
        if (!listid || !item || !sectionid || itemPosition === undefined)
            throw Error(500);

        let list = await ListService.getFullList({ listid });
        if (!list) throw Error(500);

        const section = list.sections.find(section => section.sectionid == sectionid);
        if (!section) throw Error(500);

        let items = section.items;
        let itemidOrder = section.itemidOrder.split(',');

        if (itemPosition > items.length || itemPosition < 0)
            itemPosition = items.length;

        // add the item to DB
        let result = await ListService.addItem({ sectionid: section.sectionid, item })
        const newItemID = result.lastID;

        // have to find a better way to error handle
        // as it stands, errors from ListService will bubble up and the strings will be used as HTTP Error Codes
        itemidOrder.splice(itemPosition, 0, newItemID);
        result = await ListService.updateItemOrder({ sectionid: section.sectionid, itemidOrder: itemidOrder.join(',') });

        res.send(200, { item: { itemid: newItemID, ...item } });
    } catch(e) {
        res.send(e.message, { message: 'Unable to add item.' })
    }
};