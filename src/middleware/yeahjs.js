const yeahjs = require('yeahjs');
const { readFileSync } = require('fs');
const { join } = require('path');

const VIEWS_DIR = '../views';
const getView = filename => join(__dirname, VIEWS_DIR, filename);

// yeahjs template engine
// depends on middleware/send
module.exports = () => (_, res, next) => {
    res.render = (view, data = {}, status = 200) => {
        try {
            const fileString = readFileSync(getView(view), 'utf8');

            const template = yeahjs.compile(fileString, {
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