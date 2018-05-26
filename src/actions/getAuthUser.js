export const getAuthUser = (value) => {
    return dispatch => {
        dispatch({ type: 'AUTH_USER', payload: value });
    }
} 