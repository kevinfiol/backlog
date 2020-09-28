const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const config = require ('../config.js');

(async () => {
    // open database
    try {
        const db = await open({
            driver: sqlite3.Database,
            ...config.database
        });

        await db.migrate({
            force: true
        });
    } catch(e) {
        console.error('Failed to migrate database!: ' + e.message);
    }
})();