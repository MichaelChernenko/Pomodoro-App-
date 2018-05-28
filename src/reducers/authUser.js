const initialState = {
    userID: ""
};

export default function authUser(state = initialState, action) {
    if (action.type === 'AUTH_USER') {
        return {
            ...state,
            userID: action.payload
        }
    }
    return state;
};
