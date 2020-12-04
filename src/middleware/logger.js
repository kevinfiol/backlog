// logger middleware
export default () => (req, _, next) => {
    console.log(`~> [${req.method}] ${req.url}`);
    next();
};