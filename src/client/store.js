import { createStore, Provider, connect } from 'unistore/full/preact'
import actions from './actions.js';

// initial list from server
const { list } = window.viewData;

const initialState = {
    list,
    error: null,
    isChanging: false,
    isSorting: false,
    showItems: true,
    sortables: [],
    sorting: { movedItems: null }
};

const store = createStore(initialState);
store.subscribe(console.log);

export { store, actions, connect, Provider };