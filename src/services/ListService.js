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

    async getSectionsForList({ listid }) {
        try {
            const sections = await this.db.query(`
                SELECT Item.*, Section.listid, Section.itemidOrder, List.sectionidOrder
                FROM Item
                INNER JOIN Section ON Item.sectionid = Section.sectionid
                INNER JOIN List ON Section.listid = :listid;
            `, {
                ':listid': 1
            });

            const items = await this.db.query(`

            `)
        }
    }
};

module.exports = ListService;