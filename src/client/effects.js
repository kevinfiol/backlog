import request from '../util/request.js';

const httpFx = async (dispatch, props) => {
    try {
        let res;

        if (props.method === 'POST')
            res = await request.post(props.url, props.params);
        else
            res = await request.get(props.url, props.params);

        const data = await res.json();
        dispatch(props.action, data);
    } catch(e) {
        dispatch(props.error, e);
    }
};

export const http = props => [httpFx, props];