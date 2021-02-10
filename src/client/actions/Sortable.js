import { Sortable, MultiDrag } from 'sortablejs';
import { setState, getFullList } from './init.js';
import { http } from './effects/http.js';

// necessary for multidrag items
Sortable.mount(new MultiDrag());

export const addSortables = (state, { sortables }) => [setState, {
    sortables: [...state.sortables, ...sortables]
}];

export const setMoved = (state, { moved }) => {
    for (let [itemid, { originalSection, newSection }] of Object.entries(moved)) {
        if (originalSection === newSection) {
            moved[itemid] = undefined;
        }
    }

    return [setState, { sorting: { moved } }];
};

export const destroySortables = state => {
    for (let sortable of state.sortables) {
        sortable.destroy();
    }

    return { ...state, sortables: [] };
}

export const beginSorting = state => [
    state,
    mountSortableList(),
    mountSortableItems(),
    [
        dispatch => {
            dispatch(setState, { isSorting: true });
        }
    ]
];

export const saveSorting = state => [
    state,
    [
        dispatch => {
            const { sectionidOrder, itemidOrders } = getNewOrders();
            dispatch(setState, { list: { sections: [] } });
            dispatch(updateListOrders, { sectionidOrder, itemidOrders, moved: state.sorting.moved || {} });
            dispatch(stopSorting);
        }
    ]
];

export const stopSorting = state => [
    state,
    [
        dispatch => {
            dispatch(destroySortables);
            dispatch(setState, { list: { sections: [] }, sortables: [], isSorting: false, moved: null });
            dispatch(getFullList);
        }
    ]
];

export const mountSortableList = () => [
    (dispatch) => requestAnimationFrame(() => {
        const sortable = createSortableList(dispatch);
        dispatch(addSortables, { sortables: [sortable] });
    })
]; 

export const mountSortableItems = () => [
    (dispatch) => requestAnimationFrame(() => {
        const sortables = createSortableItemLists(dispatch);
        dispatch(addSortables, { sortables });
    })
];

export const updateListOrders = (state, { sectionidOrder, itemidOrders, moved }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/updateListOrders',
        params: {
            listid: state.list.listid,
            sectionidOrder,
            itemidOrders,
            moved
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];

function createSortableList(dispatch) {
    // mount SortableJS on List, allowing sorting of sections
    const sortable = Sortable.create(document.getElementById('list'), {
        animation: 100,
        multiDrag: false,
        draggable: '.section',
        onStart: function(event) {
            dispatch(setState, { showItems: false }); // hide items while sorting sections
        },
        onEnd: function(event) {
            dispatch(setState, { showItems: true });
        }
    });

    return sortable;
}

function createSortableItemLists(dispatch) {
    const sortables = [];

    for (let itemList of document.getElementsByClassName('item-list')) {
        let sortable;

        sortable = Sortable.create(itemList, {
            group: 'shared-items', // items can be moved between sections
            animation: 100,
            multiDrag: true,
            selectedClass: 'sortablejs__item--selected',
            onEnd: function(event) {
                const moved = {}; // keep track of items to update sectionid of

                if (event.to.id !== event.from.id) {
                    if (event.items.length > 1) {
                        event.items.forEach(item => {
                            moved[item.id] = { originalSection: item.dataset.sectionid, newSection: event.to.id };
                        });
                    } else {
                        moved[event.item.id] = { originalSection: event.item.dataset.sectionid, newSection: event.to.id };
                    }
                }

                if (Object.keys(moved).length > 0) {
                    dispatch(setMoved, { moved })
                }
            }
        });

        sortables.push(sortable);
    }

    return sortables;
}

function getNewOrders() {
    const sectionids = [];
    const sections = {};
    for (let section of document.getElementsByClassName('item-list')) {
        sectionids.push(section.id);
        
        const itemids = [];

        for (let item of section.getElementsByClassName('item')) {
            itemids.push(item.id);
        }
        
        sections[section.id] = itemids.join(',');
    }

    return { sectionidOrder: sectionids.join(','), itemidOrders: sections };
}