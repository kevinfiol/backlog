import slugify from '../util/slugify.js';
import groupBy from '../util/groupBy.js';
import { fromIntCSV } from '../util/fromCSV.js';
import typecheck from '../util/typecheck.js';

const ListService = {
    init(db) {
        this.db = db;
    },

    async getListsForUser({ userid }) {
        try {
            typecheck({ number: userid });
            const lists = await this.db.all('List', { userid });

            typecheck({ array: lists });
            return lists;
        } catch(e) {
            throw Error('Could not retrieve lists for user.');
        }
    },

    async getListBySlug({ slug, username }) {
        try {
            typecheck({ strings: [slug, username] });

            const rows = await this.db.query(`
                SELECT List.listid
                FROM List
                LEFT JOIN User on User.userid = List.userid
                WHERE List.slug = :slug
                AND User.username = :username
            `, {
                ':slug': slug,
                ':username': username
            });

            typecheck({ array: rows });
            return rows;
        } catch(e) {
            throw Error('Could not retrieve List by slug and username.')
        }
    },

    async getSection({ sectionid }) {
        try {
            typecheck({ number: sectionid });
            const section = await this.db.get('Section', { sectionid });

            typecheck({ object: section });
            return section;
        } catch(e) {
            throw Error('Could not retrieve Section by sectionid.');
        }
    },

    async getFullList({ listid }) {
        try {
            typecheck({ number: listid });

            const rows = await this.db.query(`
                SELECT
                    User.username,
                    List.*, List.slug AS listslug,
                    Section.sectionid, Section.sectionname, Section.itemidOrder, Section.slug AS sectionslug,
                    Item.*
                FROM Item
                LEFT JOIN Section ON Item.sectionid = Section.sectionid
                LEFT JOIN List ON Section.listid = List.listid
                LEFT JOIN User ON User.userid = List.userid
                WHERE List.listid = :listid
            `, {
                ':listid': listid
            });

            // retrieve list metadata
            const list = {
                listid: rows[0].listid,
                listname: rows[0].listname,
                slug: rows[0].listslug,
                date_created: rows[0].date_created,
                date_updated: rows[0].date_updated,
                userid: rows[0].userid,
                username: rows[0].username,
                sectionidOrder: fromIntCSV(rows[0].sectionidOrder),
                sections: []
            };

            const groupedBySectionid = groupBy('sectionid', rows);

            for (let i = 0, len = list.sectionidOrder.length; i < len; i++) {
                const sectionid = list.sectionidOrder[i];
                const itemList = groupedBySectionid[`${sectionid}`]; // int to str
                const sectionname = itemList[0].sectionname;
                const sectionslug = itemList[0].sectionslug;
                const itemidOrder = fromIntCSV(itemList[0].itemidOrder); // grab itemidOrder from first item

                // iterate items
                const items = [];
                for (let j = 0, len = itemidOrder.length; j < len; j++) {
                    const itemid = itemidOrder[j];
                    const idx = itemList.findIndex(i => i.itemid === itemid);
                    const tempItem = itemList[idx];
                    itemList.splice(idx, 1); // remove index for next search

                    items.push({
                        itemid: tempItem.itemid,
                        itemname: tempItem.itemname,
                        sectionid: tempItem.sectionid,
                        slug: tempItem.slug,
                        url: tempItem.url
                    });
                }

                const section = {
                    sectionid: sectionid,
                    sectionname: sectionname,
                    slug: sectionslug,
                    listid: list.listid,
                    itemidOrder: itemidOrder,
                    items: items
                };

                list.sections.push(section);
            }

            typecheck({ object: list });
            return list;
        } catch(e) {
            console.error(e);
            throw Error('Could not retrieve items for list.');
        }
    },

    async addItem({ sectionid, item }) {
        try {
            typecheck({ number: sectionid, object: item });

            const result = await this.db.run(`
                INSERT INTO Item (itemname, slug, url, sectionid)
                VALUES (:itemname, :slug, :url, :sectionid)
            `, {
                ':itemname': item.itemname.trim(),
                ':slug': slugify(item.itemname),
                ':url': item.url.trim() || null,
                ':sectionid': parseInt(sectionid)
            });

            if (result.changes < 1)
                throw Error('Was not able to make changes to database.');

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error(`Unable to add new Item. ${e.message}`);
        }
    },

    async editItem({ item }) {
        try {
            typecheck({ object: item });

            const result = await this.db.update('Item', {
                itemname: item.itemname,
                url: item.url,
                slug: slugify(item.itemname)
            }, { itemid: item.itemid });

            if (result.changes < 1)
                throw Error('Was not able to make changes to database.');

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error(`Unable to edit Item. ${e.message}`);
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

            if (result.changes < 1)
                throw Error('Was not able to make changes to database.');

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error(`Unable to remove Item. ${e.message}`);
        }
    },

    async updateItemOrder({ sectionid, itemidOrder }) {
        try {
            typecheck({ number: sectionid, string: itemidOrder });

            const result = await this.db.run(`
                UPDATE Section
                SET itemidOrder = :itemidOrder
                WHERE sectionid = :sectionid
            `, {
                ':itemidOrder': itemidOrder.trim(),
                ':sectionid': sectionid
            });

            if (result.changes < 1)
                throw Error('Was not able to update itemidOrder');

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error(`Unable to update Section. ${e.message}`);
        }
    }
};

export default ListService;