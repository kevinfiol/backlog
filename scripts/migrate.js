const sqlite3Offline = require('sqlite3-offline');
const { open } = require('sqlite');
const config = require ('../config.js');

(async () => {
    // open database
    const db = await open({
        driver: sqlite3Offline.Database,
        ...config.database
    });

    await db.migrate({
        force: false
    });
})();