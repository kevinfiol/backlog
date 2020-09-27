const session = require('express-session');
const FileStore = require('session-file-store')(session);
const { nanoid } = require('nanoid'); 
const { sessionConfig } = require('../container.js');

const NANOID_LENGTH = 36;

module.exports = () => {
    return session({
        ...sessionConfig,
        genid: () => nanoid(NANOID_LENGTH),
        store: new FileStore({})
    });
};