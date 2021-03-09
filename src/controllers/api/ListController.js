import { ListService, SectionService, ItemService } from '../../container.js';
import { fromIntCSV } from '../../util/fromCSV.js';
import typecheck from '../../util/typecheck.js';

export const getFullList = async function(req, res) {
    try {
        let listid = req.query.listid;
        typecheck({ string: listid });
        listid = parseInt(listid);

        const list = await ListService.getFullList({ listid });
        typecheck({ object: list });
        res.send(200, { list });
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to retrieve full list.' });
    }
};

export const addItem = async function(req, res) {
    try {
        let { item, sectionid, itemPosition } = req.body;
        typecheck({ object: item, numbers: [sectionid, itemPosition] });

        const section = await SectionService.getSection({ sectionid });
        if (!section) throw Error('Section does not exist.');

        const itemidOrder = fromIntCSV(section.itemidOrder);
        if (itemPosition > itemidOrder.length || itemPosition < 0)
            itemPosition = itemidOrder.length;

        // add the item to DB
        let result = await ItemService.addItem({ sectionid: section.sectionid, item })
        const newItemID = result.lastID;

        itemidOrder.splice(itemPosition, 0, newItemID);
        result = await SectionService.updateItemOrder({ sectionid: section.sectionid, itemidOrder: itemidOrder.join(',') });

        typecheck({ object: item, number: newItemID });
        res.send(200, { item: { ...item, itemid: newItemID } });
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to add item.' })
    }
};

export const editItem = async function(req, res) {
    try {
        let { item } = req.body;
        typecheck({ object: item });

        const editedItem = { itemid: item.itemid, itemname: item.itemname, url: item.url };
        let result = await ItemService.editItem({ item: editedItem });

        typecheck({ object: editedItem });
        res.send(200, { item: { ...editedItem } })
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to edit item.' });
    }
};

export const removeItem = async function(req, res) {
    try {
        let { itemid, sectionid } = req.body;
        typecheck({ numbers: [itemid, sectionid] });

        const section = await SectionService.getSection({ sectionid });

        let itemidOrder = fromIntCSV(section.itemidOrder);
        if (!itemidOrder.includes(itemid)) throw Error('Item not in given section');

        const itemPosition = itemidOrder.indexOf(itemid);
        itemidOrder.splice(itemPosition, 1);

        let result = await SectionService.updateItemOrder({ sectionid, itemidOrder: itemidOrder.join(',') });
        result = await ItemService.removeItem({ itemid });

        typecheck({ number: itemid });
        res.send(200, { itemid });
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to remove item.' });
    }
};

export const addSection = async function(req, res) {
    try {
        let { sectionname, listid } = req.body;
        console.log(listid);
        typecheck({ string: sectionname, number: listid });

        const list = await ListService.getList({ listid });
        if (list.listid === undefined) throw Error('List does not exist.');

        const result = await SectionService.addSection({ listid, sectionname });
        const newSectionID = result.lastID;

        let sectionidOrder = fromIntCSV(list.sectionidOrder);
        sectionidOrder.splice(0, 0, newSectionID);
        sectionidOrder = sectionidOrder.join(',');

        await ListService.updateSectionOrder({ listid, sectionidOrder });
        res.send(200);
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to add section.' });
    }
};

export const editSection = async function(req, res) {
    try {
        let { sectionid, sectionname } = req.body;
        typecheck({ number: sectionid, string: sectionname });

        await SectionService.editSection({ sectionid, sectionname });
        res.send(200);
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to edit section.' });
    }
};

export const removeSection = async function(req, res) {
    try {
        let { sectionid } = req.body;
        typecheck({ number: sectionid });

        await SectionService.removeSection({ sectionid });
        res.send(200);
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occured. Unable to remove section.' });
    }
};

export const updateListOrders = async function(req, res) {
    try {
        let { listid, sectionidOrder, itemidOrders } = req.body;
        typecheck({ number: listid, string: sectionidOrder, object: itemidOrders });

        // validate that the ids provided by the client correctly belong to the specified list
        const areIdsValid = await validateListOrders(listid, sectionidOrder, itemidOrders);
        if (!areIdsValid) throw Error('Invalid ids supplied to updateListOrders');

        const promises = [];
        promises.push(ListService.updateSectionOrder({ listid, sectionidOrder }));

        for (let [sectionid, itemidOrder] of Object.entries(itemidOrders)) {
            promises.push(SectionService.updateItemOrder({ sectionid: parseInt(sectionid), itemidOrder }));
        }

        await Promise.all(promises);
        res.send(200);
    } catch(e) {
        console.error(e);
        res.send(500, { message: 'Error occurred. Unable update list orders.' });
    }
}

async function validateListOrders(listid, sectionidOrder, itemidOrders) {
    const [validSectionids, validItemids] = await Promise.all([
        SectionService.getSectionsByListid({ listid }),
        ItemService.getItemsByListid({ listid })
    ]);

    // validate sectionids and itemids
    let allSectionids = [
        ...sectionidOrder.split(',').map(sectionid => sectionid),
        ...Object.keys(itemidOrders).map(sectionid => sectionid)
    ];

    let allItemids = [
        ...Object.values(itemidOrders).reduce((a, c) => [...a, ...c.split(',')], [])
    ];

    // narrowIds removes dups, empty strings, and parses Ints
    allSectionids = narrowIds(allSectionids);
    allItemids = narrowIds(allItemids);

    for (let sectionid of allSectionids) {
        if (!validSectionids.includes(sectionid)) return false;
    }

    for (let itemid of allItemids) {
        if (!validItemids.includes(itemid)) return false;
    }

    return true;
}

function narrowIds(ids) {
    return Array.from(
        new Set( // use Set to remove dups
            ids
                .filter(id => id !== '') // remove empty strings
                .map(id => parseInt(id)) // only ints
        )
    );
}