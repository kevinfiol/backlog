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
    },

    async getReviews(userid) {
        try {
            typecheck({ number: userid });
            let reviews = await this.db.all('Review', { userid });
            if (reviews === undefined) reviews = [];

            typecheck({ array: reviews });
            return reviews;
        } catch(e) {
            throw Error('Could not retrieve Reviews for User: ' + e);
        }
    },

    async getReview(params) {
        try {
            typecheck({ object: params });
            let review = await this.db.get('Review', params);
            if (review === undefined) review = {};

            typecheck({ object: review });
            return review;
        } catch (e) {
            throw Error('Could not retrieve Review: ' + e);
        }
    },

    async addReview({ reviewname, reviewtext, userid }) {
        try {
            typecheck({ strings: [reviewname, reviewtext], number: userid });
            const result = await this.db.insert('Review', {
                reviewname: reviewname.trim(),
                reviewtext: reviewtext.trim(),
                userid
            });

            typecheck({ object: result });
            return result;
        } catch(e) {
            throw Error('Could not add new Review: ' + e);
        }
    },

    async editReview({ reviewid, reviewname, reviewtext }) {
        try {
            typecheck({ number: reviewid, strings: [reviewname, reviewtext] });
            const result = await this.db.update('Review', {
                reviewname: reviewname.trim(),
                reviewtext: reviewtext.trim()
            }, {
                reviewid
            });

            typecheck({ object: result });
            return result;
        } catch (e) {
            throw Error('Could not update Review: ', + e);
        }
    },

    async removeReview({ reviewid }) {
        try {
            typecheck({ number: reviewid });

            const result = await this.db.run(`
                DELETE FROM Review
                WHERE reviewid = :reviewid
            `, {
                ':reviewid': reviewid
            });

            typecheck({ object: result });
            return result;
        } catch (e) {
            throw Error('Unable to remove Review: ' + e);
        }
    }
};

export default UserService;