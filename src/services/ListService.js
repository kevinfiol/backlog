import slugify from '../util/slugify.js';
import groupBy from '../util/groupBy.js';
import { fromIntCSV } from '../util/fromCSV.js';
import typecheck from '../util/typecheck.js';

const ListService = {
    init(db) {
        this.db = db;
    },

    async getList(params) {
        try {
            typecheck({ object: params });
            let list = await this.db.get('List', params);
            if (list === undefined) list = {};

            typecheck({ object: list });
            return list;
        } catch(e) {
            throw Error('Could not retrieve list: ' + e);
        }
    },

    async getLists(params) {
        try {
            typecheck({ object: params });
            const rows = await this.db.all('List', params);

            typecheck({ array: rows });
            return rows;
        } catch(e) {
            throw Error('Could not retrieve lists: ' + e);
        }
    },

    async getListsForUser({ userid }) {
        try {
            typecheck({ number: userid });
            const rows = await this.db.all('List', { userid });

            typecheck({ array: rows });
            return rows;
        } catch(e) {
            throw Error('Could not retrieve lists for user: ' + e);
        }
    },

    async getListBySlugAndUsername({ slug, username }) {
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
            throw Error('Could not retrieve List by slug and username: ' + e)
        }
    },

    async addList({ listname, userid }) {
        try {
            typecheck({ string: listname, number: userid });

            const result = await this.db.insert('List', {
                listname: listname.trim(),
                slug: slugify(listname),
                userid,
                sectionidOrder: ''
            });

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error('Could not add list: ' + e);
        }
    },

    async removeList({ listid }) {
        try {
            typecheck({ number: listid });
            const list = await this.getList({ listid });
            if (list === undefined) throw Error('List does not exist for given listid');

            let sectionidsStr = list.sectionidOrder !== undefined
                ? list.sectionidOrder.split(',').join(', ').trim()
                : ''
            ;

            if (sectionidsStr.length < 1) {
                // just remove list
                await this.db.exec(`
                    BEGIN TRANSACTION;
                    DELETE FROM List
                    WHERE listid = ${listid};
                    COMMIT;
                `);
            } else {
                // remove all sections and items belonging to list
                await this.db.exec(`
                    BEGIN TRANSACTION;

                    DELETE FROM Item
                    WHERE Item.sectionid IN (${sectionidsStr});

                    DELETE FROM Section
                    WHERE Section.sectionid IN (${sectionidsStr});

                    DELETE FROM List
                    WHERE List.listid = ${listid};

                    COMMIT;
                `);
            }
        } catch(e) {
            throw Error('Unable to remove List: ' + e);
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
            throw Error('Could not retrieve items for list: ' + e);
        }
    },

    async updateSectionOrder({ listid, sectionidOrder }) {
        try {
            typecheck({ number: listid, string: sectionidOrder });

            const result = await this.db.update('List', {
                sectionidOrder
            }, {
                listid
            });

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error('Unable to update List: ' + e);
        }
    }
};

export default ListService;