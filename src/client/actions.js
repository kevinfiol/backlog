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

export const sortItems = (state, { sectionOrders, moved }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/sortItems',
        params: { sectionOrders, moved },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];

export const sortSections = (state, { sectionidOrder }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/sortSections',
        params: { listid: state.list.listid, sectionidOrder },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];

export const removeSection = (state, { sectionid }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/removeSection',
        params: { sectionid },
        action: () => {
            return [getFullList, { listid: state.list.listid }];
        },
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

export const mountSortableSections = state => [
    (dispatch) => requestAnimationFrame(() => {
        // mount SortableJS on List, allowing sorting of sections
        const sortable = Sortable.create(document.getElementById('list'), {
            animation: 100,
            multiDrag: false,
            handle: '.section-handle',
            draggable: '.section',
            onChoose: function(event) {
                dispatch(setState, { showItems: false }); // hide items while sorting sections
            },
            onUnchoose: function(event) {
                dispatch(setState, { showItems: true });
            },
            onEnd: function(event) {
                const sectionEls = document.getElementById('list').getElementsByClassName('section');
                const sectionids = [];

                for (let sectionEl of sectionEls) {
                    sectionids.push(sectionEl.id);
                }

                const sectionidOrder = sectionids.join(',');
                dispatch(sortSections, { sectionidOrder });
                dispatch(setState, { showItems: true });
            }
        });
    })
]; 

export const mountSortableItems = state => [
    (dispatch) => requestAnimationFrame(() => {
        // mount SortableJS on Item Lists
        Sortable.mount(new MultiDrag());
        for (let itemList of document.getElementsByClassName('item-list')) {
            let sortable;
            sortable = Sortable.create(itemList, {
                group: 'shared-items', // items can be moved between sections
                animation: 100,
                multiDrag: true,
                selectedClass: 'sortablejs__item--selected',
                handle: '.item-handle',
                onEnd: function(event) {
                    const getNewItemOrderFromDOM = function(listID, listChildren) {
                        sectionOrders[listID] = [];

                        for (let itemEl of listChildren) {
                            sectionOrders[listID].push(itemEl.id);
                        }

                        sectionOrders[listID] = sectionOrders[listID].join(',');
                    };

                    const sectionOrders = {};
                    const moved = {};

                    getNewItemOrderFromDOM(event.from.id, event.from.children);

                    if (event.to.id !== event.from.id) {
                        // grab item order of the item list where items were moved
                        getNewItemOrderFromDOM(event.to.id, event.to.children);

                        // account for moved items between sections
                        // necessary to update item's `sectionid` foreign keys
                        moved.toSectionid = event.to.id;
                        moved.itemids = event.clones.length > 0 ? event.clones.map(itemEl => itemEl.id) : [event.clone.id];
                    }

                    dispatch(sortItems, { sectionOrders, moved });
                }
            });
        }
    })
];