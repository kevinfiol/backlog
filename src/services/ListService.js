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
            throw Error('Could not retrieve lists for user.', e);
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
            throw Error('Could not retrieve List by slug and username.', e)
        }
    },

    async getSection({ sectionid }) {
        try {
            typecheck({ number: sectionid });
            const section = await this.db.get('Section', { sectionid });

            typecheck({ object: section });
            return section;
        } catch(e) {
            throw Error('Could not retrieve Section by sectionid.', e);
        }
    },

    async getFullList({ listid }) {
        try {
            typecheck({ number: listid });

            const [listRow, sectionRows, itemRows] = await Promise.all([
                // get List & User data
                this.db.query(`
                    SELECT DISTINCT User.username, List.*
                    FROM List
                    LEFT JOIN User ON User.userid = List.userid
                    WHERE List.listid = :listid
                `, {
                    ':listid': listid
                }),

                // get Sections
                this.db.query(`
                    SELECT Section.*
                    FROM Section
                    WHERE Section.listid = :listid
                `, {
                    ':listid': listid
                }),

                // get Items
                this.db.query(`
                    SELECT Item.itemid, Item.itemname, Item.slug, Item.url, Item.sectionid
                    FROM Item
                    LEFT JOIN Section ON Item.sectionid = Section.sectionid
                    LEFT JOIN List ON List.listid = Section.listid
                    WHERE List.listid = :listid
                `, {
                    ':listid': listid
                })
            ]);

            if (listRow.length < 1)
                throw Error('No List rows were retrieved from the database.');

            const list = listRow[0];
            list.sectionidOrder = fromIntCSV(list.sectionidOrder); // parse sectionidOrder, e.g., '1,2' => [1, 2]
            list.sections = []; // init sections list

            const groupedItems = groupBy('sectionid', itemRows);
            const groupedSections = groupBy('sectionid', sectionRows);

            for (let i = 0, len = list.sectionidOrder.length; i < len; i++) {
                const sectionid = list.sectionidOrder[i];
                const itemList = groupedItems[sectionid] || [];

                // section metadata
                const section = groupedSections[sectionid][0];
                section.itemidOrder = fromIntCSV(section.itemidOrder);
                section.items = [];

                // iterate items
                for (let j = 0, len = section.itemidOrder.length; j < len; j++) {
                    const itemid = section.itemidOrder[j];
                    const idx = itemList.findIndex(i => i.itemid === itemid);
                    const item = itemList[idx];
                    itemList.splice(idx, 1); // remove index for next search
                    section.items.push(item);
                }

                list.sections.push(section);
            }

            typecheck({ object: list });
            return list;
        } catch(e) {
            console.error(e);
            throw Error('Could not retrieve items for list.', e);
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

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error('Unable to add new Item.', e);
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

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error('Unable to edit Item.', e);
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
        } catch(e) {
            throw Error('Unable to update sectionid for Item.', e);
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
        } catch(e) {
            throw Error('Unable to remove Item.', e);
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

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error('Unable to update Section.', e);
        }
    },

    async updateSectionOrder({ listid, sectionidOrder }) {
        try {
            typecheck({ number: listid, string: sectionidOrder });

            const result = await this.db.run(`
                UPDATE List
                SET sectionidOrder = :sectionidOrder
                WHERE listid = :listid
            `, {
                ':sectionidOrder': sectionidOrder.trim(),
                ':listid': listid
            });

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error('Unable to update List.', e);
        }
    }
};

export default ListService;