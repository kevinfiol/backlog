import slugify from '../util/slugify.js';
import typecheck from '../util/typecheck.js';

const ItemService = {
    init(db) {
        this.db = db;
    },

    async getItemsByListid({ listid }) {
        try {
            typecheck({ number: listid });
            const rows = await this.db.query(`
                SELECT Item.itemid
                FROM Item
                LEFT JOIN Section ON Item.sectionid = Section.sectionid
                LEFT JOIN List ON List.listid = Section.listid
                WHERE List.listid = :listid
            `, {
                ':listid': listid
            });

            const itemids = rows.map(item => item.itemid);
            return itemids;
        } catch(e) {
            throw Error('Unable to get items: ' + e);
        }
    },

    async getItemsByUserid({ userid }) {
        try {
            typecheck({ number: userid });
            const rows = await this.db.query(`
                SELECT Item.itemname
                FROM Item
                LEFT JOIN Section ON Item.sectionid = Section.sectionid
                LEFT JOIN List ON List.listid = Section.listid
                WHERE List.userid = :userid
            `, {
                ':userid': userid
            });

            const itemnames = rows.map(item => item.itemname);
            return itemnames;
        } catch (e) {
            throw Error('Unable to get items: ' + e);
        }
    },

    async addItem({ sectionid, item }) {
        try {
            typecheck({ number: sectionid, object: item });

            const result = await this.db.insert('Item', {
                itemname: item.itemname.trim(),
                slug: slugify(item.itemname),
                url: item.url.trim() || null,
                sectionid: parseInt(sectionid)
            });

            typecheck({ object: result });
            return result;
        } catch (e) {
            throw Error('Unable to add new Item: ' + e);
        }
    },

    async editItem({ item }) {
        try {
            typecheck({ object: item });

            const result = await this.db.update('Item', {
                itemname: item.itemname.trim(),
                url: item.url,
                slug: slugify(item.itemname)
            }, { itemid: item.itemid });

            typecheck({ object: result });
            return result;
        } catch (e) {
            throw Error('Unable to edit Item: ' + e);
        }
    },

    async updateItemSectionid({ itemid, sectionid }) {
        try {
            typecheck({ numbers: [itemid, sectionid] });

            const result = await this.db.update('Item', {
                sectionid: sectionid
            }, { itemid: itemid });

            typecheck({ object: result });
            return result;
        } catch (e) {
            throw Error('Unable to update sectionid for Item: ' + e);
        }
    },

    async removeItem({ itemid }) {
        try {
            typecheck({ number: itemid });

            const result = await this.db.run(`
                DELETE FROM Item
                WHERE itemid = :itemid
            `, {
                ':itemid': itemid
            });

            typecheck({ object: result });
            return result;
        } catch (e) {
            throw Error('Unable to remove Item: ' + e);
        }
    }
};

export default ItemService;