import merge from 'mergerino';
import { http } from './effects/http.js';

// Global Actions
export const setState = (state, props) => {
    const newState = merge(state, props);
    console.log(newState);
    return newState;
};

export const getFullList = state => [
    state,
    http({
        method: 'GET',
        url: '/api/list/getFullList/',
        params: { listid: state.list.listid },
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

export const preventDefault = action => (state, event) => [
    state,
    [
        (dispatch) => {
          event.preventDefault()
          if (action) dispatch(action)
        }
    ]
];