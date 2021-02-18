/**
* if config-dev.js does not exist in root directory
* create a copy of config-dev.default.js and rename it to config-dev.js
* don't delete config-dev.default.js
**/

import config_prod from './config-prod.js';
import config_dev from './config-dev.js';

let config;

if (process.env.PROD == 1)
    config = config_prod;
else
    config = config_dev;

export default config;