// logger middleware
module.exports = () => (req, _, next) => {
    console.log(`~> [${req.method}] ${req.url}`);
    next();
};