const hasher = require('../util/hasher.js');

const AuthService = {
    init(db) {
        this.db = db;
    },

    async validateAndGetUser({ username, password }) {
        try {
            // validate user exists
            let user = await this.db.get('User', { username: username.trim() });
            if (!user) return false;

            // validate password
            const { hashed } = hasher.hash(password, user.salt);
            if (hashed !== user.password) return false;

            return user;
        } catch(e) {
            throw new Error('Could not retrieve user. Check parameters.');
        }
    },

    async createUser({ username, password }) {
        const { hashed, salt } = hasher.hash(password.trim());

        try {
            const res = await this.db.insert('User', {
                username: username.trim(),
                password: hashed,
                salt: salt
            });

            return res;
        } catch(e) {
            throw new Error('Could not create new User.');
        }
    },

    async getUser(params) {
        try {
            const user = await this.db.get('User', params);
            return user;
        } catch(e) {
            throw new Error('Could not retrieve User. Check parameters.');
        }
    }
};

module.exports = AuthService;