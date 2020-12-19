import { ListService } from '../../container.js';
import { fromIntCSV } from '../../util/fromCSV.js';
import typecheck from '../../util/typecheck.js';

/**
* todo: implement some kind of rollback for adding/removing items in case error
*/

export const getFullList = async function(req, res) {
    try {
        const listid = req.query.listid;
        typecheck(['string', listid]);

        const list = await ListService.getFullList({ listid });
        typecheck(['object', list]);
        res.send(200, { list });
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to retrieve full list.' });
    }
};

export const addItem = async function(req, res) {
    try {
        let { item, sectionid, itemPosition } = req.body;
        typecheck(['object', item], ['number', sectionid], ['number', itemPosition]);

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

        typecheck(['object', item], ['number', newItemID]);
        res.send(200, { item: { ...item, itemid: newItemID } });
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to add item.' })
    }
};

export const editItem = async function(req, res) {
    try {
        let { item } = req.body;
        typecheck(['object', item]);

        const editedItem = { itemid: item.itemid, itemname: item.itemname, url: item.url };
        let result = await ListService.editItem({ item: editedItem });

        typecheck(['object', editedItem]);
        res.send(200, { item: { ...editedItem } })
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to edit item.' });
    }
};

export const removeItem = async function(req, res) {
    try {
        let { itemid, sectionid } = req.body;
        typecheck(['number', itemid], ['number', sectionid]);

        const section = await ListService.getSection({ sectionid });

        let itemidOrder = fromIntCSV(section.itemidOrder);
        if (!itemidOrder.includes(itemid)) throw Error('Item not in given section');

        const itemPosition = itemidOrder.indexOf(itemid);
        itemidOrder.splice(itemPosition, 1);

        let result = await ListService.updateItemOrder({ sectionid, itemidOrder: itemidOrder.join(',') });
        result = await ListService.removeItem({ itemid });

        typecheck(['number', itemid]);
        res.send(200, { itemid });
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to remove item.' });
    }
};