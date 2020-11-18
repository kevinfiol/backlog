import request from '../util/request.js';

export const httpFx = async (dispatch, props) => {
    try {
        let res;
        if (props.method === 'POST')
            res = await request.post(props.url, props.params);
        else
            res = await request.get(props.url, props.params);

        const data = await res.json();
        dispatch(data);
    } catch(e) {
        throw Error('HTTP Effect failed: ', e.message);
    }
};