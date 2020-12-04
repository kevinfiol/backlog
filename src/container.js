import config from '../config.js';

// session configuration
const sessionConfig = config.sessionConfig;

// services
import UserService from './services/UserService.js';
import ListService from './services/ListService.js';

// sqlite
import SQLite from './services/SQLite.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

open({
    driver: sqlite3.cached.Database,
    ...config.database
}).then(conn => {
    // init SQLite service
    SQLite.init(conn);

    // services that depend on SQLite service
    UserService.init(SQLite);
    ListService.init(SQLite);
});

export {
    // configs
    sessionConfig,

    // services
    UserService,
    ListService
};