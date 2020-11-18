import { httpFx } from './effects.js';

// helpers
const http = props => [httpFx, props];

// actions
export const setValue = (state, { key, value }) => {
    let newState = { ...state, [key]: value };
    console.log(newState);
    return newState;
};

export const addToSection = (state, { sectionid, newItem }) => {
    const sections = state.list.sections;
    const idx = sections.findIndex(section => section.sectionid == sectionid);
    sections[idx].items = [...sections[idx].items, { itemid: 5, itemname: newItem, slug: 'nah', url: 'huh' }];
    state.list.sections = sections;
    return { ...state };
};

export const InputSetter = key => (state, e) => {
    SetValue(state, { key, value: e.target.value })
};

export const getFullList = (state) => [
    state,
    http({
        method: 'GET',
        url: '/api/list/getFullList/',
        params: { listid: 1 }
    })
];