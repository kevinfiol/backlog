const fetch = require('node-fetch');

const request = {
    get(url, params = {}) {
        let query = url + '?' + buildQueryString(params);
        return fetch(query);
    },

    post(url, body = '') {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify(body)
        });
    }
};

module.exports = request;

// https://github.com/MithrilJS/mithril.js/blob/next/querystring/build.js
function buildQueryString(object) {
    if (Object.prototype.toString.call(object) !== "[object Object]") return ""

    var args = []
    for (var key in object) {
        destructure(key, object[key])
    }

    return args.join("&")

    function destructure(key, value) {
        if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                destructure(key + "[" + i + "]", value[i])
            }
        }
        else if (Object.prototype.toString.call(value) === "[object Object]") {
            for (var i in value) {
                destructure(key + "[" + i + "]", value[i])
            }
        }
        else args.push(encodeURIComponent(key) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
    }
}