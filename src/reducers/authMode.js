const initialState = {
    authMode: 'Login',
    authError: '',
    newUser: false
};

export default function authMode(state = initialState, action) {
    if (action.type === 'CHANGE_AUTH_MODE') {
        return {
            ...state,
            authMode: action.payload
        }
    } else if (action.type === 'ERROR_ON_AUTH') {
        return {
            ...state,
            authError: action.payload
        }
    } else if (action.type === 'REGISTER_USER') {
        return {
            ...state,
            newUser: action.payload
        }
    }
    return state;
};
