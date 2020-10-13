const config = require('../config.js');

// session data
const sessionConfig = config.sessionConfig;

// services
const AuthService = require('./services/AuthService.js');

// sqlite
const SQLite = require('./services/SQLite.js');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

open({
    driver: sqlite3.cached.Database,
    ...config.database
}).then(conn => {
    // init SQLite service
    SQLite.init(conn);

    // services that depend on SQLite service
    AuthService.init(SQLite);
});

module.exports = {
    // configs
    sessionConfig,

    // services
    AuthService
};