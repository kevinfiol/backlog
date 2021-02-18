const config_prod = {
    port: 8080,
    sessionConfig: {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true, httpOnly: true, sameSite: true }
    },
    api: {
        rawg: process.env.RAWG_API_KEY
    }
};

export default config_prod;