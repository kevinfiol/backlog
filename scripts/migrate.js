import config from '../config.js';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDb from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

connectDb.then(async db => {
    const original = join(__dirname, '../', config.database.filename);
    const backupFolder = join(__dirname, '../backups/');
    const backupFilename = `backlog_backup-${new Date().toLocaleDateString().split('/').join('_')}-${Date.now()}.db`;

    // create backup for db first
    try {
        if (!existsSync(backupFolder))
            mkdirSync(backupFolder);
        copyFileSync(original, join(backupFolder, backupFilename));
    } catch(e) {
        throw Error('Could not create backup,', e.message);
    }

    // initiate migration
    // `force: true` drops tables if necessary
    await db.migrate({ force: true })
}).catch(e => {
    console.error('Failed to migrate database!: ' + e.message);
});