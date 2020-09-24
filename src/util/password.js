const crypto = require('crypto');
const salt = crypto.randomBytes(32);

const password = {
    hash: (password, salt = salt, cost = 100000, digest = 'sha512') {
        const key = crypto.pbkdf2Sync(password, salt, cost, 128, digest);
        const hash = key.toString('hex');
        return hash;
    }
};

module.exports = password;