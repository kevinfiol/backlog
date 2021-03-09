import config from '../config.js';

// session configuration
const sessionConfig = config.sessionConfig;

// api keys
const rawgApiKey = config.api.rawg;

// services
import UserService from './services/UserService.js';
import ListService from './services/ListService.js';
import SectionService from './services/SectionService.js';
import ItemService from './services/ItemService.js';
// import HLTBService from './services/HLTBService.js';
import GameService from './services/GameService.js';

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
    SectionService.init(SQLite);
    ItemService.init(SQLite);
    // HLTBService.init(new HowLongToBeatService(), SQLite);
    GameService.init(SQLite, rawgApiKey);
});

export {
    // configs
    sessionConfig,

    // services
    UserService,
    ListService,
    SectionService,
    ItemService,
    // HLTBService,
    GameService
};