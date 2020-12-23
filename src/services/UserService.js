import hash from '../util/hash.js';
import typecheck from '../util/typecheck.js';

const UserService = {
    init(db) {
        this.db = db;
    },

    async validateAndGetUser({ username, password }) {
        try {
            typecheck({ string: [username, password] });

            // validate user exists
            const user = await this.db.get('User', { username });
            if (!user) return null;

            // validate password
            const { hashed } = hash(password, user.salt);
            if (hashed !== user.password) return null;

            typecheck({ object: user });
            return user;
        } catch(e) {
            throw Error('Could not validate & retrieve user.', e);
        }
    },

    async createUser({ username, password }) {
        try {
            typecheck({ string: [username, password] });
            const { hashed, salt } = hash(password);

            const res = await this.db.insert('User', {
                username: username,
                password: hashed,
                salt: salt
            });

            typecheck({ object: res });
            return res;
        } catch(e) {
            throw Error('Could not create new User.', e);
        }
    },

    async getUser(params) {
        try {
            typecheck({ object: params });
            const user = await this.db.get('User', params);

            typecheck({ object: user });
            return user;
        } catch(e) {
            throw Error('Could not retrieve User.', e);
        }
    }
};

export default UserService;