const initialState = {
    globalListTrigger: false
};

export default function globalListTrigger(state = initialState, action) {
    if (action.type === 'SWITCH_TO_GLOBAL_LIST') {
        return {
            ...state,
            globalListTrigger: action.payload
        }
    }
    return state;
};
