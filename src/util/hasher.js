import crypto from 'crypto';

const hasher = {
    hash(password, salt = undefined, cost = 100000, digest = 'sha512') {
        if (!salt) salt = crypto.randomBytes(32).toString('hex');
        const key = crypto.pbkdf2Sync(password, salt, cost, 128, digest);
        const hashed = key.toString('hex');
        return { hashed: hashed, salt: salt };
    }
};

export default hasher;