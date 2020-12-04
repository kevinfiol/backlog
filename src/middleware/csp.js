import crypto from 'crypto';

// Content-Security Policy helper
// depends on middleware/viewData
export default () => (req, res, next) => {
    // create noonce per request for inline scripts
    // see: https://content-security-policy.com/nonce/
    const nonce = crypto.randomBytes(16).toString('base64');
    const cspString = res.getHeader('Content-Security-Policy')
        .replace("script-src 'self'", `script-src 'self' 'nonce-${nonce}'`)
    ;

    res.setViewData({ nonce });
    res.setHeader('Content-Security-Policy', cspString);

    next();
};