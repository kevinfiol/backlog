import { send } from 'httpie/fetch';

const listEndpoint = (action) => `/api/list/${action}/`;
const gameEndpoint = (action) => `/api/game/${action}/`;

const api = {
    searchGame(name, fetchOpts) {
        return post(gameEndpoint('search'), { name }, fetchOpts);
    },

    getFullList(listid) {
        return get(listEndpoint('getFullList'), { listid });
    },

    updateListOrders({ listid, sectionidOrder, itemidOrders }) {
        return post(listEndpoint('updateListOrders'), {
            listid,
            sectionidOrder,
            itemidOrders
        });
    },

    // Item
    addItem({ item, sectionid, itemPosition }) {
        return post(listEndpoint('addItem'), {
            item,
            sectionid,
            itemPosition
        });
    },

    editItem({ item }) {
        return post(listEndpoint('editItem'), { item });
    },

    removeItem({ itemid, sectionid }) {
        return post(listEndpoint('removeItem'), {
            itemid,
            sectionid
        });
    },

    // Section
    addSection({ listid, sectionname }) {
        return post(listEndpoint('addSection'), {
            listid,
            sectionname
        });
    },

    editSection({ sectionid, sectionname }) {
        return post(listEndpoint('editSection'), {
            sectionid,
            sectionname
        });
    },

    removeSection({ sectionid }) {
        return post(listEndpoint('removeSection'), { sectionid });
    }
};

export default api;

function get(url, params = {}) {
    return send('GET', url + buildQueryString(params));
}

function post(url, body = {}, opts = {}) {
    return send('POST', url, { body, ...opts });
}

function buildQueryString(params) {
    return Object.entries(params).reduce((str, [key, value]) => {
        if (!str) str += '?';
        if (str.length > 1) str += '&';
        str += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        return str;
    }, '');
}