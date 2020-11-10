const ListService = {
    init(db) {
        this.db = db;
    },

    async getList(params) {
        try {
            const list = await this.db.get('List', params);
            return list;
        } catch(e) {
            throw Error('Could not retrieve List. Check parameters.');
        }
    },

    async getListBySlug({ slug, username }) {
        try {
            const rows = await this.db.query(`
                SELECT List.*, User.username
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

    async getListsForUser({ userid }) {
        try {
            const lists = await this.db.all('List', { userid });
            return lists;
        } catch(e) {
            throw Error('Could not retrieve lists for user.');
        }
    },

    async getListContent({ listid }) {
        try {
            const rows = await this.db.query(`
                SELECT
                    List.listid, List.listname, List.sectionidOrder,
                    Section.sectionid, Section.sectionname, Section.itemidOrder,
                    Item.*
                FROM Item
                LEFT JOIN Section ON Item.sectionid = Section.sectionid
                LEFT JOIN List ON Section.listid = List.listid
                WHERE List.listid = :listid
            `, {
                ':listid': listid
            });

            if (rows.length < 1)
                return [];

            const sectionidOrder = fromCSV(rows[0]['sectionidOrder']); // [1, 2]
            const sections = groupBy('sectionid', rows); // { 1: [...items], 2: [...items] }

            const sortedList = sectionidOrder
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

            return sortedList;
        } catch(e) {
            throw Error('Could not retrieve items for list.');
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