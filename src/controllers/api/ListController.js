import { ListService } from '../../container.js';
import { fromIntCSV } from '../../util/fromCSV.js';
import validate from '../../util/validate.js';

/**
* todo: implement some kind of rollback for adding/removing items in case error
*/

export const getFullList = async function(req, res) {
    // query params
    const listid = req.query.listid;

    try {
        const typecheck = validate({ listid: 'tString' }, { listid });
        if (!typecheck.ok) throw typecheck.errors;

        const list = await ListService.getFullList({ listid });
        res.send(200, { list });
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to retrieve full list.' });
    }
};

export const addItem = async function(req, res) {
    let { item, sectionid, itemPosition } = req.body;

    try {
        const typecheck = validate(
            { item: 'object', sectionid: 'number', itemPosition: 'number' },
            { item, sectionid, itemPosition }
        );

        if (!typecheck.ok) throw typecheck.errors;

        const section = await ListService.getSection({ sectionid });
        if (!section) throw Error('Section does not exist.');

        const itemidOrder = fromIntCSV(section.itemidOrder);
        if (itemPosition > itemidOrder.length || itemPosition < 0)
            itemPosition = itemidOrder.length;

        // add the item to DB
        let result = await ListService.addItem({ sectionid: section.sectionid, item })
        const newItemID = result.lastID;

        itemidOrder.splice(itemPosition, 0, newItemID);
        result = await ListService.updateItemOrder({ sectionid: section.sectionid, itemidOrder: itemidOrder.join(',') });

        res.send(200, { item: { ...item, itemid: newItemID } });
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to add item.' })
    }
};

export const editItem = async function(req, res) {
    let { item } = req.body;

    try {
        const typecheck = validate({ item: 'object' }, { item });
        if (!typecheck.ok) throw typecheck.errors;

        const editedItem = { itemid: item.itemid, itemname: item.itemname, url: item.url };
        let result = await ListService.editItem({ item: editedItem });

        res.send(200, { item: { ...editedItem } })
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to edit item.' });
    }
};

export const removeItem = async function(req, res) {
    let { itemid, sectionid } = req.body;

    try {
        const typecheck = validate({ itemid: 'number', sectionid: 'number' }, { itemid, sectionid });
        if (!typecheck.ok) throw typecheck.errors;

        const section = await ListService.getSection({ sectionid });

        let itemidOrder = fromIntCSV(section.itemidOrder);
        if (!itemidOrder.includes(itemid)) throw Error('Item not in given section');

        const itemPosition = itemidOrder.indexOf(itemid);
        itemidOrder.splice(itemPosition, 1);

        let result = await ListService.updateItemOrder({ sectionid, itemidOrder: itemidOrder.join(',') });
        result = await ListService.removeItem({ itemid });

        res.send(200, { itemid });
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to remove item.' });
    }
};