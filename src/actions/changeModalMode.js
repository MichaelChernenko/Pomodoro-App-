export const changeModalMode = (value) => {
    return dispatch => {
        dispatch({ type: 'CHANGE_MODAL_MODE', payload: value });
    }
} 