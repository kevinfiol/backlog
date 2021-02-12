import { setState, getFullList } from './init.js';
import { http } from './effects/http.js';
import { action } from './effects/action.js';

export const addSectionFormInput = key => (state, e) => [setState, {
    section: {
        addForm: { [key]: e.target.value }
    }
}];

export const editSectionFormInput = key => (state, e) => [setState, {
    section: {
        editForm: { [key]: e.target.value }
    }
}];

export const initAddSectionForm = state => [setState, {
    section: {
        isAdding: true
    }
}];

export const initEditSectionForm = (state, { section }) => [setState, {
    section: {
        isEditing: true,
        editForm: {
            sectionid: section.sectionid,
            sectionname: section.sectionname
        }
    }
}];

export const initRemoveSection = (state, { sectionid }) => [setState, {
    section: {
        isRemoving: true,
        removeForm: { sectionid }
    }
}];

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

export const resetRemoveSection = state => [setState, {
    section: {
        isRemoving: false,
        removeForm: { sectionid: null }
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