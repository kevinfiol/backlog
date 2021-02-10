import { setState, getFullList } from './init.js';
import { http } from './effects/http.js';
import { action } from './effects/action.js';

export const resetEditItemForm = state => [setState, {
    item: {
        itemid: null,
        isEditing: false,
        editForm: { itemid: null, itemname: '', url: '' }
    }
}];

export const resetAddItemForm = state => [setState, {
    item: {
        itemid: null,
        isAdding: false,
        addForm: { item: { itemname: '', url: '' }, sectionid: null, itemPosition: null }
    }
}];

export const resetRemoveItemForm = state => [setState, {
    item: {
        itemid: null,
        isRemoving: false,
        removeForm: { itemid: null, sectionid: null }
    }
}];

// Actions w/ Side Effects
export const addItem = (state, { item, sectionid, itemPosition }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/addItem/',
        params: { sectionid, itemPosition, item },
        action: () => {
            return [getFullList];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    }),
    action({
        action: resetAddItemForm
    })
];

export const editItem = (state, { item }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/editItem/',
        params: { item },
        action: () => {
            return [getFullList];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    }),
    action({
        action: resetEditItemForm
    })
];

export const removeItem = (state, { itemid, sectionid }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/removeItem',
        params: { itemid, sectionid },
        action: () => {
            return [getFullList];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    }),
    action({
        action: resetRemoveItemForm
    })
];