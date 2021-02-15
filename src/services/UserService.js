import hash from '../util/hash.js';
import typecheck from '../util/typecheck.js';

const UserService = {
    init(db) {
        this.db = db;
    },

    async validateAndGetUser({ username, password }) {
        try {
            typecheck({ strings: [username, password] });

            // validate user exists
            const user = await this.db.get('User', { username });
            if (user === undefined) return {};

            // validate password
            const { hashed } = hash(password, user.salt);
            if (hashed !== user.password) return {};

            typecheck({ object: user });
            return user;
        } catch(e) {
            throw Error('Could not validate & retrieve user: ' + e);
        }
    },

    async createUser({ username, password }) {
        try {
            typecheck({ strings: [username, password] });
            const { hashed, salt } = hash(password);

            const result = await this.db.insert('User', {
                username: username,
                password: hashed,
                salt: salt
            });

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error('Could not create new User: ' + e);
        }
    },

    async getUser(params) {
        try {
            typecheck({ object: params });
            let user = await this.db.get('User', params);
            if (user === undefined) user = {};

            typecheck({ object: user });
            return user;
        } catch(e) {
            throw Error('Could not retrieve User: ' + e);
        }
    }
};

export default UserService;