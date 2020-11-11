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

    async getFullList({ listid }) {
        // make so this gets all List metadata as well
        try {
            const rows = await this.db.query(`
                SELECT
                    User.username,
                    List.*, List.slug AS listslug,
                    Section.sectionid, Section.sectionname, Section.itemidOrder,
                    Item.*
                FROM Item
                LEFT JOIN Section ON Item.sectionid = Section.sectionid
                LEFT JOIN List ON Section.listid = List.listid
                LEFT JOIN User ON User.userid = List.userid
                WHERE List.listid = :listid
            `, {
                ':listid': listid
            });

            if (rows.length < 1)
                return [];

            const list = {
                listid: rows[0].listid,
                listname: rows[0].listname,
                userid: rows[0].userid,
                username: rows[0].username,
                sectionidOrder: rows[0].sectionidOrder,
                date_created: rows[0].date_created,
                date_updated: rows[0].date_updated,
                slug: rows[0].listslug,
                sections: undefined
            };

            const sectionidOrderArr = fromCSV(list.sectionidOrder); // [1, 2]
            const sections = groupBy('sectionid', rows); // { 1: [...items], 2: [...items] }

            list.sections = sectionidOrderArr
                // order sections first
                // [{section obj}, {section obj}]
                .map(sectionid => {
                    const items = sections[sectionid];
                    const { sectionname, itemidOrder } = items[0];
                    return { sectionid, sectionname, itemidOrder, items };
                })
                // order individual items within sections
                // [ section obj 1: { items: [{}, {}, ...] }, section obj 2: { ... }]
                .map(section => {
                    const itemidOrder = fromCSV(section.itemidOrder);

                    section.items = itemidOrder.map(id => {
                        const item = section.items.find(item => item.itemid == id);
                        const { itemid, itemname, slug, url } = item;
                        return { itemid, itemname, slug, url };
                    });

                    return section;
                })
            ;

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
    return csv.split(',').map(n => parseInt(n));
}

module.exports = ListService;