const { ListService } = require('../../container.js');

exports.getFullList = async function(req, res) {
    // route params
    const listid = req.getRouteParam('listid');

    try {
        // check if route param is valid
        if (!listid) throw Error('List does not exist');
        const list = await ListService.getFullList({ listid });

        res.send(200, list);
    } catch(e) {
        res.send(500, { message: e.message });
    }
};

exports.addItem = async function(req, res) {
    let { listid, sectionid, itemPosition, item } = req.body;

    try {
        if (!listid || !item || !sectionid || itemPosition === undefined)
            throw Error('Invalid body parameters.');

        let list = await ListService.getFullList({ listid });
        if (!list) throw Error('List does not exist.');

        const section = list.sections.find(section => section.sectionid == sectionid);
        if (!section) throw Error('Section does not exist.');

        let items = section.items;
        let itemidOrder = section.itemidOrder.split(',');

        if (itemPosition > items.length || itemPosition < 0)
            itemPosition = items.length;

        // add the item to DB
        let result = await ListService.addItem({ sectionid: section.sectionid, item })
        const newItemID = result.lastID;

        itemidOrder.splice(itemPosition, 0, newItemID);
        result = await ListService.updateItemOrder({ sectionid: section.sectionid, itemidOrder: itemidOrder.join(',') });

        res.send(200, { item: { itemid: newItemID, ...item } });
    } catch(e) {
        res.send(500, { message: e.message })
    }
};