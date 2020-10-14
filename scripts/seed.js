const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const config = require ('../config.js');
const hasher = require('../src/util/hasher.js');
const slugify = require('../src/util/slugify.js');

open({
    driver: sqlite3.cached.Database,
    ...config.database
}).then(async db => {
    // create dummy user and populate User table
    const user = { name: 'kevin', password: 'hunter2' };
    const { hashed, salt } = hasher.hash(user.password);

    await db.run(`
        INSERT INTO User (username, password, salt)
        VALUES (:username, :password, :salt)
    `, {
        ':username': user.name,
        ':password': hashed,
        ':salt': salt
    });

    // create Lists for user
    await db.run(`
        INSERT INTO List (listname, slug, userid, itemidOrder)
        VALUES 
            ('my backlog', '${slugify('my backlog')}', 1, '1,2,3'),
            ('indie backlog', '${slugify('indie backlog')}', 1, '6,4,5')
    `);

    // create Items for above lists
    await db.run(`
        INSERT INTO Item (itemname, url, listid)
        VALUES
            ('Final Fantasy II', 'https://www.igdb.com/games/final-fantasy-ii', 1),
            ('Kirbys Dreamland 3', NULL, 1),
            ('Doom', 'https://en.wikipedia.org/wiki/Doom_(1993_video_game)', 1),
            ('Factorio', 'https://www.igdb.com/games/factorio', 2),
            ('Bastion', 'https://www.igdb.com/games/bastion', 2),
            ('Dustforce', NULL, 2)
    `)
}).catch(e => {
    console.error('Failed to seed database: ' + e.message);
});