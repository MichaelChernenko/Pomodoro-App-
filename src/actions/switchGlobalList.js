export const switchGlobalList = (value) => {
    return dispatch => {
        dispatch({ type: 'SWITCH_TO_GLOBAL_LIST', payload: value });
    }
} 