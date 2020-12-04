import merge from 'mergerino';
import { http } from './effects/http.js';
import { action } from './effects/action.js';

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
            console.log('new list...', list);
            return { ...state, list };
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];

export const addItem = (state, { sectionid, itemPosition, item, initialItem }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/addItem/',
        params: { sectionid, itemPosition, item },
        action: () => {
            return [getFullList, { listid: state.list.listid }];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    }),
    action({
        action: setState,
        payload: {
            isAddingItem: false,
            itemToAdd: { item: { ...initialItem } }
        }
    })
];

export const editItem = (state, { item }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/editItem/',
        params: { item },
        action: () => {
            return [getFullList, { listid: state.list.listid }];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    }),
    action({
        action: setState,
        payload: { isEditingItem: false }
    })
];

export const removeItem = (state, { itemid, sectionid }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/removeItem',
        params: { itemid, sectionid },
        action: () => {
            return [getFullList, { listid: state.list.listid }];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    }),
    action({
        action: setState,
        payload: { isRemovingItem: false }
    })
];