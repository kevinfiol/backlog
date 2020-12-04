const SQLite = {
    init(conn) {
        this.conn = conn;
    },

    run(stmt, params = {}) {
        return this.conn.run(stmt, params);
    },

    query(stmt, params = {}) {
        return this.conn.all(stmt, params);
    },

    // returns single row
    get(tbl, params = {}, cols = '*') {
        const stmt = `SELECT ${cols} FROM ${tbl}` + wheres(params);
        return this.conn.get(stmt, Object.values(params));
    },

    // returns many rows
    all(tbl, params = {}, cols = '*') {
        const stmt = `SELECT ${cols} FROM ${tbl}` + wheres(params);
        return this.conn.all(stmt, Object.values(params));
    },

    insert(tbl, params = {}) {
        const keys = Object.keys(params);
        const stmt = `INSERT INTO ${tbl}`
            + ` (${keys.join(',')})`
            + ` VALUES (${keys.map(k => ':' + k).join(',')})`
        ;

        return this.conn.run(stmt, bindify(params));
    },

    update(tbl, params = {}, whereParams = {}) {
        let stmt = `UPDATE ${tbl}`
            + ' SET'
            + Object.keys(params).map(col => ` ${col} = :${col}`)
            + wheres(whereParams)
        ;

        return this.conn.run(stmt, bindify({ ...params, ...whereParams }));
    }
};

export default SQLite;

function wheres(params = {}) {
    let clause = '';
    let keys = Object.keys(params);

    for (let i = 0; i < keys.length; i++) {
        let str = i === 0 ? 'WHERE' : 'AND';
        clause += ` ${str} ${keys[i]} = :${keys[i]}`;
    }

    return clause;
}

function bindify(params = {}) {
    // turns {a: 2, b: 3} into {':a': 2, ':b': 3}
    return Object.keys(params).reduce((a, c) => {
        a[':' + c] = params[c];
        return a;
    }, {});
}