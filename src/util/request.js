import { send } from 'httpie/fetch';

const request = {
    get(url, params = {}) {
        return send('GET', url + buildQueryString(params));
    },

    post(url, body = {}) {
        return send('POST', url, { body })
    }
};

export default request;

function buildQueryString(params) {
    return Object.entries(params).reduce((str, [key, value]) => {
        if (!str) str += '?';
        if (str.length > 1) str += '&';
        str += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        return str;
    }, '');
}