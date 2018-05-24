export const getTasks = (value) => {
    return dispatch => {
        dispatch({ type: 'GET_TASKS', payload: value });
    }
} 