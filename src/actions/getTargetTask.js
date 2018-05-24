export const getTargetTask = (value) => {
    return dispatch => {
        dispatch({ type: 'GET_TARGET_TASK', payload: value });
    }
} 