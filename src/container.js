const config = require('../config.js');

// session data
const sessionConfig = config.sessionConfig;

// sqlite
const SQLite = require('./services/SQLite.js');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

open({ driver: sqlite3.cached.Database, ...config.database })
    .then(db => SQLite.init(db))
;

module.exports = {
    // configs
    sessionConfig
};