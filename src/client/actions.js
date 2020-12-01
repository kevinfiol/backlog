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
        action: (state, { list }) => {
            console.log('new list has been retrieved...', list);
            return { ...state, list };
        },
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
        action: (state, props) => {
            console.log('new item created', props.item);
            return [getFullList, { listid: state.list.listid }];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];

export const editItem = (state, { item }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/editItem/',
        params: { item },
        action: (state, props) => {
            console.log(`${props.item.itemid} has been edited`, props.item);
            return [getFullList, { listid: state.list.listid }];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];