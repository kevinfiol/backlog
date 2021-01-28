import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import config from '../config.js';

const connectDb = open({
    driver: sqlite3.cached.Database,
    ...config.database
});

export default connectDb;