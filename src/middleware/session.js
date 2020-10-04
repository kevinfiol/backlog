const session = require('express-session');
const FileStore = require('session-file-store')(session);
const uuid = require('@lukeed/uuid');
const { sessionConfig } = require('../container.js');

module.exports = () => {
    return session({
        ...sessionConfig,
        genid: () => uuid(),
        store: new FileStore({ path: './sessions' })
    });
};