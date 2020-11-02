const L = require('list');

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

    async getListsForUser({ userid }) {
        try {
            const lists = await this.db.all('List', { userid });
            return lists;
        } catch(e) {
            throw Error('Could not retrieve lists for user.');
        }
    },

    async getItemsForList({ listid }) {
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

            const sectionidOrder = fromCSV(rows[0]['sectionidOrder']);

            // create immutable list
            const fullList = L.from(rows);
            const sections = L.groupWith((a, b) => a.sectionid === b.sectionid, fullList);

            const sortedSections = L.map(section => {
                const itemidOrder = fromCSV(L.nth(0, section)['itemidOrder']);
                return L.map(id => L.find(item => item.itemid == id, section), itemidOrder);
            }, sections);

            const sortedList = L.map(id => L.find(section => section.sectionid == id), sectionidOrder);

            return [];
        } catch(e) {
            console.log(e);
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