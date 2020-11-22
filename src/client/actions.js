import merge from 'mergerino';
import { http } from './effects/http.js';

// actions
export const setState = (state, props) => {
    let newState = merge(state, props);
    console.log(newState);
    return newState;
};

export const getFullList = (state, { listid }) => [
    state,
    http({
        method: 'GET',
        url: '/api/list/getFullList/',
        params: { listid },
        action: (state, list) =>
            ({ ...state, list })
        ,
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];

export const addItem = (state, { listid, sectionid, itemPosition, item }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/addItem/',
        params: { listid, sectionid, itemPosition, item },
        action: (state, item) => {
            console.log('new item created', item);
            return [getFullList];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];