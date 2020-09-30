// redirect helper
module.exports = () => (_, res, next) => {
    res.redirect = location => {
        const str = `Redirecting to ${location}`;
        res.writeHead(302, {
            Location: location,
            'Content-Type': 'text/plain',
            'Content-Length': str.length,
        });
        res.end(str);
    };

    next();
};