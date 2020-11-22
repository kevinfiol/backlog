import request from '../../util/request.js';

const httpFx = async (dispatch, props) => {
    try {
        let res;
        const params = props.params || {};

        if (props.method === 'POST')
            res = await request.post(props.url, params);
        else
            res = await request.get(props.url, params);

        const data = await res.json();

        if (props.action)
            dispatch(props.action, data);
    } catch(e) {
        dispatch(props.error, e);
    }
};

export const http = props => [httpFx, props];