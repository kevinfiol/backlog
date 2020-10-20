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
        INSERT INTO List (listname, slug, userid, sectionidOrder)
        VALUES 
            ('my backlog', '${slugify('my backlog')}', 1, '1,2'),
            ('indie backlog', '${slugify('indie backlog')}', 1, '4,3')
    `);

    // create Sections for above lists
    await db.run(`
        INSERT INTO Section (sectionname, slug, listid, itemidOrder)
        VALUES
            ('list to complete', '${slugify('list to complete')}', 1, '1,2'),
            ('completed', '${slugify('completed')}', 1, '4,3'),
            ('indies to replay', '${slugify('indies to replay')}', 2, '6,5'),
            ('indies completed', '${slugify('indies completed')}', 2, '8,7')
    `);

    // create Items for above lists
    await db.run(`
        INSERT INTO Item (itemname, slug, url, sectionid)
        VALUES
            ('Final Fantasy II', '${slugify('Final Fantasy II')}', 'https://www.igdb.com/games/final-fantasy-ii', 1),
            ('Kirbys Dreamland 3','${slugify('Kirbys Dreamland 3')}', NULL, 1),
            ('Doom', '${slugify('Doom')}', 'https://en.wikipedia.org/wiki/Doom_(1993_video_game)', 2),
            ('Super Mario Sunshine', '${slugify('Super Mario Sunshine')}', NULL, 2),
            ('Factorio', '${slugify('Factorio')}', 'https://www.igdb.com/games/factorio', 3),
            ('Bastion', '${slugify('Bastion')}', 'https://www.igdb.com/games/bastion', 3),
            ('Dustforce', '${slugify('Dustforce')}', NULL, 4),
            ('Spelunky 2', '${slugify('Spelunky 2')}', NULL, 4)
    `)
}).catch(e => {
    console.error('Failed to seed database: ' + e.message);
});