import session from 'express-session';
import FileStoreFactory from 'session-file-store';
import { v4 } from '@lukeed/uuid';
import { sessionConfig } from '../container.js';

const FileStore = FileStoreFactory(session);

export default () => {
    return session({
        ...sessionConfig,
        genid: () => v4(),
        store: new FileStore({ path: './sessions' })
    });
};