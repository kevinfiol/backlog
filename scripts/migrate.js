const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const config = require ('../config.js');

open({
    driver: sqlite3.Database,
    ...config.database
}).then(async db => {
    await db.migrate({ force: true })
}).catch(e => {
    console.error('Failed to migrate database!: ' + e.message);
});