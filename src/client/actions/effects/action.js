const actionFx = (dispatch, props) => {
    dispatch(props.action, props.payload);
};

export const action = props => [actionFx, props];