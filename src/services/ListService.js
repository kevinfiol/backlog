const slugify = require('../util/slugify.js');

const ListService = {
    init(db) {
        this.db = db;
    },

    async getListsForUser({ userid }) {
        try {
            const lists = await this.db.all('List', { userid });
            return lists;
        } catch(e) {
            throw Error('Could not retrieve lists for user.');
        }
    },

    async getListBySlug({ slug, username }) {
        try {
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

            return rows;
        } catch(e) {
            throw Error('Could not retrieve List by slug and username.')
        }
    },

    async getSection({ sectionid }) {
        try {
            const section = await this.db.get('Section', { sectionid });
            return section;
        } catch(e) {
            throw Error('Could not retrieve Section by sectionid.');
        }
    },

    async getFullList({ listid }) {
        try {
            const sections = await this.db.query(`
                SELECT
                    User.username, List.*,
                    Section.sectionid, Section.sectionname, Section.itemidOrder
                FROM Section
                LEFT JOIN List ON Section.listid = List.listid
                LEFT JOIN User ON User.userid = List.userid
                WHERE List.listid = :listid
            `, {
                ':listid': listid
            });

            const sectionidOrder = fromCSV(sections[0].sectionidOrder);

            // do this weird string manipulation to avoid risk of sql injection
            const items = await this.db.query(`
                SELECT itemid, itemname, slug, url, sectionid
                FROM Item
                WHERE sectionid in (${sectionidOrder.map(x => '?').join(',')})
            `, sectionidOrder);

            // group items by sectionid
            const groupedItems = groupBy('sectionid', items);

            // create list
            const list = sections.reduce((listObj, section) => {
                if (!listObj.listid) {
                    listObj = {
                        // this are List properties *not* Section properties
                        username: section.username,
                        userid: section.userid,
                        listid: section.listid,
                        listname: section.listname,
                        slug: section.slug,
                        sectionidOrder: section.sectionidOrder,
                        date_created: section.date_created,
                        date_updated: section.date_updated,
                        sections: []
                    };
                }

                const itemidOrder = fromCSV(section.itemidOrder);
                const items = itemidOrder.map(id =>
                    groupedItems[section.sectionid].find(item => item.itemid === id)
                );

                listObj.sections = [...listObj.sections, {
                    listid: listObj.listid,
                    sectionid: section.sectionid,
                    sectionname: section.sectionname,
                    itemidOrder: section.itemidOrder,
                    items
                }];

                return listObj;
            }, {});

            return list;
        } catch(e) {
            throw Error('Could not retrieve items for list.');
        }
    },

    async addItem({ sectionid, item }) {
        try {
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

            return result;
        } catch(e) {
            throw Error(`Unable to add new Item. ${e.message}`);
        }
    },

    async editItem({ item }) {
        // todo: have to modify this to account for editing review
        try {
            const result = await this.db.update('Item', {
                itemname: item.itemname,
                url: item.url,
                slug: slugify(item.itemname)
            }, { itemid: item.itemid });

            if (result.changes < 1)
                throw Error('Was not able to make changes to database.');

            return result;
        } catch(e) {
            throw Error(`Unable to edit Item. ${e.message}`);
        }
    },

    async removeItem({ itemid }) {
        try {
            const result = await this.db.run(`
                DELETE FROM Item
                WHERE itemid = :itemid
            `, {
                ':itemid': itemid
            });

            if (result.changes < 1)
                throw Error('Was not able to make changes to database.');

            return result;
        } catch(e) {
            throw Error(`Unable to remove Item. ${e.message}`);
        }
    },

    async updateItemOrder({ sectionid, itemidOrder }) {
        try {
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

            return result;
        } catch(e) {
            throw Error(`Unable to update Section. ${e.message}`);
        }
    }
};

function groupBy(key, arr) {
    return arr.reduce((acc, cur) => {
        if (!acc[cur[key]]) acc[cur[key]] = [];
        acc[cur[key]].push(cur);
        return acc;
    }, {});
}

function fromCSV(csv) {
    return csv.trim().length ? csv.split(',').map(n => parseInt(n)) : [];
}

module.exports = ListService;