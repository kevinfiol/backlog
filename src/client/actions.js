import merge from 'mergerino';
import { http } from './effects/http.js';
import { action } from './effects/action.js';

export const setState = (state, props) => {
    const newState = merge(state, props);
    console.log(newState);
    return newState;
};

export const preventDefault = action => (state, event) => [
    state,
    [
        (dispatch) => {
          event.preventDefault()
          if (action) dispatch(action)
        }
    ]
];

export const itemListOnDrop = (state, { sectionid }) => {
    const sections = state.list.sections;
    const sectionIdx = sections.findIndex(section => section.sectionid === sectionid);
    const section = sections[sectionIdx];

    const draggedIdx = section.items.indexOf(state.dnd.drag);
    const droppedIdx = section.items.indexOf(state.dnd.drop);

    const insertionIdx = draggedIdx < droppedIdx ? droppedIdx + 1 : droppedIdx;
    const deletionIdx = draggedIdx > droppedIdx ? draggedIdx + 1 : draggedIdx;

    if (insertionIdx !== deletionIdx) {
        section.items.splice(insertionIdx, 0, state.dnd.drag);
        section.items.splice(deletionIdx, 1);
    }

    sections[sectionIdx] = section;

    return [setState, {
        dnd: { drag: null, drop: null },
        list: { sections }
    }];
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