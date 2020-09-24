const session = require('express-session');
const uuid = require('uuid'); 
const FileStore = require('session-file-store')(session);
const { sessionConfig } = require('../container.js');

module.exports = () => {
    return session({
        ...sessionConfig,
        genid: () => uuid.v4(),
        store: new FileStore({})
    });
};