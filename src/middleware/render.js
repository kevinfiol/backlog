import { compile } from 'yeahjs';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const VIEWS_DIR = '../views';

const __dirname = dirname(fileURLToPath(import.meta.url));
const getView = filename => join(__dirname, VIEWS_DIR, filename);

// yeahjs template engine
// depends on middleware/send
export default () => (_, res, next) => {
    res.render = (view, data = {}, status = 200) => {
        try {
            const fileString = readFileSync(getView(view), 'utf8');

            const template = compile(fileString, {
                filename: view,
                localsName: 'it',
                resolve: (_, filename) => getView(filename),
                read: filename => readFileSync(filename, 'utf8')
            });

            const html = template(data);
            res.send(status, html, { 'Content-Type': 'text/html' });
        } catch (e) {
            res.send(500, e.message || e);
        }
    };

    next();
};