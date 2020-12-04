import watch from 'node-watch';
import { fork } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

let app;
let initialRun = true;

const runApp = () => {
    if (initialRun) initialRun = false;
    if (app !== undefined) app.kill()

    console.log(`=> ${initialRun ? 'Starting' : 'Restarting'} application process...`);
    app = fork(join(__dirname, './run.js'));

    app.on('close', () => {
      console.log(`=> Exiting application process...`);
    });
};

// initial run
runApp();

// only watch src folder
watch(join(__dirname, './src'), {
    recursive: true,
    filter(f, skip) {
        // skip client folder
        if (/\/client/.test(f)) return skip;
        // skip static folder
        if (/\/static/.test(f)) return skip;
        // only watch for js files
        return /\.js$/.test(f);
    }
}, runApp);