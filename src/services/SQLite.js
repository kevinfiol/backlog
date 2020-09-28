const SQLite = {
    init(db) {
        this.db = db;
    },

    // returns single row
    async get(col, tbl, params = {}) {
        let stmt = `SELECT ${col} FROM ${tbl}`;

        let keys = Object.keys(params);
        for (let i = 0; i < keys.length; i++) {
            let clause = i === 0 ? 'WHERE' : 'AND'
            stmt += ` ${clause} ${keys[i]} = ?`
        }

        console.log(stmt);
        const result = await this.db.get(stmt, Object.values(params));
        return result;
    }
};

module.exports = SQLite;