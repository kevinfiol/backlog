import { Sortable, MultiDrag } from 'sortablejs';
import { setState, getFullList } from './init.js';
import { http } from './effects/http.js';

// necessary for multidrag items
Sortable.mount(new MultiDrag());

export const getFullListAndRemount = state => [
    state,
    http({
        method: 'GET',
        url: '/api/list/getFullList/',
        params: { listid: state.list.listid },
        action: (state, { list }) => {
            return [
                state,
                [
                    dispatch => {
                        dispatch(setState, { list });

                        const newSortables = [
                            createSortableList(dispatch),
                            ...createSortableItemLists(dispatch)
                        ];

                        dispatch(setState, { sortables: newSortables });
                    }
                ]
            ]
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];

export const refreshList = (state) => [
    state,
    [
        dispatch => {
            dispatch(setState, { list: { sections: [] } });
            dispatch(getFullListAndRemount);
        }
    ]
];

export const sortItems = (state, { sectionOrders, moved }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/sortItems',
        params: { sectionOrders, moved },
        action: () => {
            return [
                state,
                [
                    dispatch => {
                        dispatch(destroySortables);
                        dispatch(refreshList);
                    }
                ]
            ];
        },
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
        action: () => {

        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];

export const addSortables = (state, { sortables }) => [setState, {
    sortables: [...state.sortables, ...sortables]
}];

export const destroySortables = state => {
    for (let sortable of state.sortables) {
        sortable.destroy();
    }

    return { ...state, sortables: [] };
}

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

function createSortableList(dispatch) {
    // mount SortableJS on List, allowing sorting of sections
    const sortable = Sortable.create(document.getElementById('list'), {
        animation: 100,
        multiDrag: false,
        handle: '.section-handle',
        draggable: '.section',
        onStart: function(event) {
            dispatch(setState, { showItems: false }); // hide items while sorting sections
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

        sortables.push(sortable);
    }

    return sortables;
}