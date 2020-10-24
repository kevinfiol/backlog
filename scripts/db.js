const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const config = require ('../config.js');

module.exports = open({
    driver: sqlite3.cached.Database,
    ...config.database
});