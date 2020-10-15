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
    }
};

module.exports = ListService;