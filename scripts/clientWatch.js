import watch from 'node-watch';
import bundleClient from './bundleClient.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

let app;
let initialRun = true;

const runBundleClient = () => {
    console.log(`=> ${initialRun ? 'Bundling' : 'Rebundling'} client code...`);
    if (initialRun) initialRun = false;
    bundleClient({
        minify: false,
        sourcemap: true
    });
};

// initial run
runBundleClient();

// only watch client folder
watch(join(__dirname, '../src/client'), {
    recursive: true,
    filter(f, skip) {
        // only watch for js files
        return /\.js$/.test(f);
    }
}, runBundleClient);