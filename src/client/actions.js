import merge from 'mergerino';
import { Sortable, MultiDrag } from 'sortablejs';
import { http } from './effects/http.js';
import { action } from './effects/action.js';

export const setState = (state, props) => {
    const newState = merge(state, props);
    console.log(newState);
    return newState;
};

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

export const addItem = (state, { item, sectionid, itemPosition }) => [
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
            return [getFullList, { listid: state.list.listid }];
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
            return [getFullList, { listid: state.list.listid }];
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

export const resortItems = (state, { sectionid, newItemOrder }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/resortItems',
        params: { newItemOrder, sectionid },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];

// DOM-y Effects
export const preventDefault = action => (state, event) => [
    state,
    [
        (dispatch) => {
          event.preventDefault()
          if (action) dispatch(action)
        }
    ]
];

export const mountSortables = (state) => [
    (dispatch) => requestAnimationFrame(() => {
        // mount SortableJS elements
        Sortable.mount(new MultiDrag());
        for (let itemList of document.getElementsByClassName('item-list')) {
            let sortable;
            sortable = Sortable.create(itemList, {
                animation: 100,
                multiDrag: true,
                selectedClass: 'sortablejs__item--selected',
                handle: '.handle',
                onEnd: function(event) {
                    // grab sectionid from dom
                    const sectionid = parseInt(event.srcElement.id);
                    const itemEls = event.srcElement.children;
                    let newItemOrder = [];

                    for (let itemEl of itemEls) {
                        newItemOrder.push(itemEl.id);
                    }

                    newItemOrder = newItemOrder.join(',');

                    dispatch(resortItems, { sectionid, newItemOrder });
                }
            });
        }
    })
];