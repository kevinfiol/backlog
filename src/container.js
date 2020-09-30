const config = require('../config.js');

// session data
const sessionConfig = config.sessionConfig;

// services
const AuthService = require('./services/AuthService.js');

// sqlite
const SQLite = require('./services/SQLite.js');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

(async () => {
    const conn = await open({ driver: sqlite3.cached.Database, ...config.database });
    SQLite.init(conn);

    // init services
    AuthService.init(SQLite);
})();

module.exports = {
    // configs
    sessionConfig,

    // services
    AuthService
};