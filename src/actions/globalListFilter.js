export const globalListFilter = (value) => {
    return dispatch => {
        dispatch({ type: 'FILTER_GLOBAL_LIST', payload: value });
    }
} 