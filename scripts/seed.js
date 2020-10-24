const connectDb = require('./db.js');
const hasher = require('../src/util/hasher.js');
const slugify = require('../src/util/slugify.js');

const user = {
    name: 'kevin',
    password: 'hunter2',
    lists: [
        { listname: 'my backlog', userid: 1, sectionidOrder: '1,2' },
        { listname: 'indie backlog', userid: 1, sectionidOrder: '4,3' }
    ],
    sections: [
        { sectionname: 'list to complete', listid: 1, itemidOrder: '1,2' },
        { sectionname: 'completed', listid: 1, itemidOrder: '4,3' },
        { sectionname: 'indies to replay', listid: 2, itemidOrder: '6,5' },
        { sectionname: 'indies completed', listid: 2, itemidOrder: '8,7' }
    ],
    items: [
        { itemname: 'Final Fantasy II', url: 'https://www.igdb.com/games/final-fantasy-ii', sectionid: 1 },
        { itemname: 'Kirbys Dreamland 3', url: null, sectionid: 1 },
        { itemname: 'Doom', url: 'https://en.wikipedia.org/wiki/Doom_(1993_video_game)', sectionid: 2 },
        { itemname: 'Super Mario Sunshine', url: null, sectionid: 2 },
        { itemname: 'Factorio', url: 'https://www.igdb.com/games/factorio', sectionid: 3 },
        { itemname: 'Bastion', url: 'https://www.igdb.com/games/bastion', sectionid: 3 },
        { itemname: 'Dustforce', url: null, sectionid: 4 },
        { itemname: 'Spelunky 2', url: null, sectionid: 4 }
    ]
}

connectDb.then(async db => {
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
        ${user.lists.map(list => `
            ('${list.listname}', '${slugify(list.listname)}', ${list.userid}, '${list.sectionidOrder}')
        `)}
    `);

    // create Sections for above lists
    await db.run(`
        INSERT INTO Section (sectionname, slug, listid, itemidOrder)
        VALUES
        ${user.sections.map(section => `
            ('${section.sectionname}', '${slugify(section.sectionname)}', ${section.listid}, '${section.itemidOrder}')
        `)}
    `);

    // create Items for above lists
    await db.run(`
        INSERT INTO Item (itemname, slug, url, sectionid)
        VALUES
        ${user.items.map(item => `
            ('${item.itemname}', '${slugify(item.itemname)}', ${item.url ? `'${item.url}'` : 'NULL'}, ${item.sectionid})
        `)}
    `)
}).catch(e => {
    console.error('Failed to seed database: ' + e.message);
});