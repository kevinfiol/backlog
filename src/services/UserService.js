const hasher = require('../util/hasher.js');

const UserService = {
    init(db) {
        this.db = db;
    },

    async validateAndGetUser({ username, password }) {
        try {
            // validate user exists
            const user = await this.db.get('User', { username });
            if (!user) return null;

            // validate password
            const { hashed } = hasher.hash(password, user.salt);
            if (hashed !== user.password) return null;

            return user;
        } catch(e) {
            throw Error('Could not validate & retrieve user.', e);
        }
    },

    async createUser({ username, password }) {
        const { hashed, salt } = hasher.hash(password);

        try {
            const res = await this.db.insert('User', {
                username: username,
                password: hashed,
                salt: salt
            });

            return res;
        } catch(e) {
            throw Error('Could not create new User.', e);
        }
    },

    async getUser(params) {
        try {
            const user = await this.db.get('User', params);
            return user;
        } catch(e) {
            throw Error('Could not retrieve User.', e);
        }
    }
};

module.exports = UserService;