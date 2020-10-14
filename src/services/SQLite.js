const SQLite = {
    init(conn) {
        this.conn = conn;
    },

    // returns single row
    get(tbl, params = {}, cols = '*') {
        const stmt = `SELECT ${cols} FROM ${tbl}` + wheres(params);
        console.log(stmt);
        return this.conn.get(stmt, Object.values(params));
    },

    // returns many rows
    all(tbl, params = {}, cols = '*') {
        const stmt = `SELECT ${cols} FROM ${tbl}` + wheres(params);
        console.log(stmt);
        return this.conn.all(stmt, Object.values(params));
    },

    insert(tbl, params = {}) {
        const keys = Object.keys(params);
        const stmt = `INSERT INTO ${tbl}`
            + ` (${keys.join(',')})`
            + ` VALUES (${keys.map(k => ':' + k).join(',')})`
        ;
        console.log(stmt);
        return this.conn.run(stmt, ...Object.values(params));
    },

    update(tbl, params = {}, whereParams = {}) {
        let stmt = `UPDATE ${tbl}`
            + Object.keys(params).map(col => ` SET ${col} = ?`)
            + wheres(whereParams)
        ;
        console.log(stmt);
        return this.conn.run(stmt, ...Object.values(params));
    }
};

module.exports = SQLite;

function wheres(params = {}) {
    let clause = '';
    let keys = Object.keys(params);

    for (let i = 0; i < keys.length; i++) {
        let str = i === 0 ? 'WHERE' : 'AND';
        clause += ` ${str} ${keys[i]} = :${keys[i]}`;
    }

    return clause;
}