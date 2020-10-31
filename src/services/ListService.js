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
            let allItems = await this.db.query(`
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

            // create immutable list
            allItems = L.from(allItems);

            const sections = L.groupWith((a, b) => a.sectionid === b.sectionid, allItems);
            console.log(sections);

            return [];
        } catch(e) {
            throw Error('Could not retrieve items for list.');
        }
    }
};

module.exports = ListService;