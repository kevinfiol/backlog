const session = require('express-session');
const FileStore = require('session-file-store')(session);
const { v4 } = require('@lukeed/uuid');
const { sessionConfig } = require('../container.js');

module.exports = () => {
    return session({
        ...sessionConfig,
        genid: () => v4(),
        store: new FileStore({ path: './sessions' })
    });
};