import { send } from 'httpie/fetch';

const endpoint = (action) => `/api/list/${action}/`;

const api = {
    getFullList(listid) {
        return get(endpoint('getFullList'), { listid });
    },

    // Item
    addItem({ item, sectionid, itemPosition }) {
        return post(endpoint('addItem'), {
            item,
            sectionid,
            itemPosition
        });
    },

    editItem({ item }) {
        return post(endpoint('editItem'), { item });
    },

    removeItem({ itemid, sectionid }) {
        return post(endpoint('removeItem'), {
            itemid,
            sectionid
        });
    },

    // Section
    addSection({ listid, sectionname }) {
        return post(endpoint('addSection'), {
            listid,
            sectionname
        });
    },

    editSection({ sectionid, sectionname }) {
        return post(endpoint('editSection'), {
            sectionid,
            sectionname
        });
    },

    removeSection({ sectionid }) {
        return post(endpoint('removeSection'), { sectionid });
    }
};

export default api;

function get(url, params = {}) {
    return send('GET', url + buildQueryString(params));
}

function post(url, body = {}) {
    return send('POST', url, { body })
}

function buildQueryString(params) {
    return Object.entries(params).reduce((str, [key, value]) => {
        if (!str) str += '?';
        if (str.length > 1) str += '&';
        str += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        return str;
    }, '');
}