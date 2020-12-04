import { ListService } from '../../container.js';

export const getFullList = async function(req, res) {
    // route params
    const listid = req.query.listid;

    try {
        // check if route param is valid
        if (!listid) throw Error('List does not exist');
        const list = await ListService.getFullList({ listid });

        res.send(200, { list });
    } catch(e) {
        res.send(500, { message: e.message });
    }
};

export const addItem = async function(req, res) {
    let { listid, sectionid, itemPosition, item } = req.body;

    try {
        if (!listid || !item || !sectionid || itemPosition === undefined)
            throw Error('Invalid body parameters.');

        let list = await ListService.getFullList({ listid });
        if (!list) throw Error('List does not exist.');

        const section = list.sections.find(section => section.sectionid == sectionid);
        if (!section) throw Error('Section does not exist.');

        // might be able to get away with not needing the listid here,
        // and skipping having to getFullList and searching the sections
        // but then will need to find way to get section data

        let items = section.items;
        let itemidOrder = section.itemidOrder.split(',');

        if (itemPosition > items.length || itemPosition < 0)
            itemPosition = items.length;

        // add the item to DB
        let result = await ListService.addItem({ sectionid: section.sectionid, item })
        const newItemID = result.lastID;

        itemidOrder.splice(itemPosition, 0, newItemID);
        result = await ListService.updateItemOrder({ sectionid: section.sectionid, itemidOrder: itemidOrder.join(',') });

        res.send(200, { item: { ...item, itemid: newItemID } });
    } catch(e) {
        res.send(500, { message: e.message })
    }
};

export const editItem = async function(req, res) {
    let { item } = req.body;

    try {
        if (!item) throw Error('Invalid body parameters.');

        const editedItem = { itemid: item.itemid, itemname: item.itemname, url: item.url };
        let result = await ListService.editItem({ item: editedItem });

        res.send(200, { item: { ...editedItem } })
    } catch(e) {
        res.send(500, { message: e.message });
    }
};

export const removeItem = async function(req, res) {
    let { itemid, sectionid } = req.body;

    try {
        if (!itemid) throw Error('Invalid body parameters');
        const section = await ListService.getSection({ sectionid });

        itemid = itemid.toString(); // have to use itemid as string
        let itemidOrder = section.itemidOrder.split(',');
        if (!itemidOrder.includes(itemid)) throw Error('Item not in given section');

        const itemPosition = itemidOrder.indexOf(itemid);
        itemidOrder.splice(itemPosition, 1);

        let result = await ListService.updateItemOrder({ sectionid, itemidOrder: itemidOrder.join(',') });
        result = await ListService.removeItem({ itemid });

        res.send(200, { itemid });
    } catch(e) {
        console.error(e);
        res.send(500, { message: e.message });
    }
};