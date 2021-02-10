import { setState, getFullList } from './init.js';
import { http } from './effects/http.js';
import { action } from './effects/action.js';

export const resetAddSectionForm = state => [setState, {
    section: {
        isAdding: false,
        addForm: { sectionname: '' }
    }
}]

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