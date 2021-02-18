const config_dev = {
    port: 8080,
    database: {
        filename: './backlog.db'
    },
    sessionConfig: {
        name: 'my.connect.sid',
        secret: 'not-so-secret-secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true, sameSite: true }
    },
    api: {
        rawg: 'PUT_YOUR_RAWG_API_KEY_HERE'
    }
};

export default config_dev;