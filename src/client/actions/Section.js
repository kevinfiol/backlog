import { setState, getFullList } from './init.js';
import { http } from './effects/http.js';
import { action } from './effects/action.js';

export const resetAddSectionForm = state => [setState, {
    section: {
        isAdding: false,
        addForm: { sectionname: '' }
    }
}]

export const resetEditSectionForm = state => [setState, {
    section: {
        isEditing: false,
        editForm: { sectionid: null, sectionname: '' }
    }
}];

// Actions w/ Side Effects
export const addSection = (state, { sectionname }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/addSection',
        params: { sectionname, listid: state.list.listid },
        action: () => {
            return [getFullList];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    }),
    action({
        action: resetAddSectionForm
    })
];

export const editSection = (state, { sectionid, sectionname }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/editSection',
        params: { sectionid, sectionname },
        action: () => {
            return [getFullList];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    }),
    action({
        action: resetEditSectionForm
    })
];

export const removeSection = (state, { sectionid }) => [
    state,
    http({
        method: 'POST',
        url: '/api/list/removeSection',
        params: { sectionid },
        action: () => {
            return [getFullList];
        },
        error: (state, error) => {
            console.error(error);
            return { ...state, error };
        }
    })
];