const initialState = {
    modalMode: ''
};

export default function changeModalMode(state = initialState, action) {
    if (action.type === 'CHANGE_MODAL_MODE') {
        return {
            ...state,
            modalMode: action.payload
        }
    }
    return state;
};
