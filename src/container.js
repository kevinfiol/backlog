const config = require('../config.js');

// session configuration
const sessionConfig = config.sessionConfig;

// services
const UserService = require('./services/UserService.js');
const ListService = require('./services/ListService.js');

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
    UserService.init(SQLite);
    ListService.init(SQLite);
});

module.exports = {
    // configs
    sessionConfig,

    // services
    UserService,
    ListService
};