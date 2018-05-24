export const switchSettings = (value) => {
    return dispatch => {
        dispatch({ type: 'SWITCH_TO_CATEGORIES', payload: value });
    }
} 