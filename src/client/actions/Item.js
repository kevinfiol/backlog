import { setState, getFullList } from './init.js';
import { http } from './effects/http.js';
import { action } from './effects/action.js';

export const addItemFormInput = key => (state, e) => [setState, {
    item: {
        addForm: {
            item: { [key]: e.target.value }
        }
    }
}];

export const editItemFormInput = key => (state, e) => [setState, {
    item: {
        editForm: { [key]: e.target.value }
    }
}];

export const initEditItemForm = (state, { item }) => [setState, {
    item: {
        itemid: item.itemid,
        isEditing: true,
        editForm: {
            itemid: item.itemid,
            itemname: item.itemname,
            url: item.url
        }
    }
}];

export const initAddItemForm = (state, { item, itemPosition }) => [setState, {
    item: {
        itemid: item.itemid,
        isAdding: true,
        addForm: {
            sectionid: item.sectionid,
            itemPosition: itemPosition + 1
        }
    }
}];

export const initRemoveItem = (state, { item }) => [setState, {
    item: {
        itemid: item.itemid,
        isRemoving: true,
        removeForm: {
            itemid: item.itemid,
            sectionid: item.sectionid
        }
    }
}];

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