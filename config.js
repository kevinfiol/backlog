let config;

if (process.env.PROD == 1)
    config = {
        port: 8080,
        sessionConfig: {
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: { secure: true, httpOnly: true, sameSite: true }
        }
    };
else
    config = {
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
        }
    };

export default config;