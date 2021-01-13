import request from '../../util/request.js';

const httpFx = async (dispatch, props) => {
    try {
        const params = props.params || {};
        const method = props.method.toLowerCase() || 'get';
        const res = await request[method](props.url, params);
        if (!res.ok) throw res;
        if (props.action) dispatch(props.action, res.data);
    } catch(e) {
        dispatch(props.error, e);
    }
};

export const http = props => [httpFx, props];