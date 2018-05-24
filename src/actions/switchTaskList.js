export const switchTaskList = (value) => {
    return dispatch => {
        dispatch({ type: 'SWITCH_TO_DONE', payload: value });
    }
} 