import { createStore, Provider, connect } from 'unistore/full/preact'

// initial list from server
const { list } = window.viewData;

const initialState = {
    list,
    error: null,
    isChanging: false,
    isSorting: false,
    showItems: true
};

const store = createStore(initialState);

export { store, connect, Provider };