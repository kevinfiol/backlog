import env from 'env-smart';
env.load();

const config = {
    port: process.env.PORT,
    database: {
        filename: process.env.DB_FILENAME
    },
    sessionConfig: {
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET,
        resave: process.env.SESSION_RESAVE,
        saveUninitialized: process.env.SESSION_SAVE_UNINITIALIZED,
        cookie: {
            secure: process.env.SESSION_COOKIE_SECURE,
            httpOnly: process.env.SESSION_COOKIE_HTTPONLY,
            sameSite: process.env.SESSION_COOKIE_SAMESITE
        }
    },
    api: {
        rawg: process.env.RAWG_API
    }
};

export default config;