const initialState = {
    filter: 'all'
};

export default function globalListFilter(state = initialState, action) {
    if (action.type === 'FILTER_GLOBAL_LIST') {
        return {
            ...state,
            filter: action.payload
        }
    }
    return state;
};
