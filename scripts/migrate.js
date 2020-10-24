const connectDb = require('./db.js');

connectDb.then(async db => {
    await db.migrate({ force: true })
}).catch(e => {
    console.error('Failed to migrate database!: ' + e.message);
});