const initialState = [{}];

export default function targetTask(state = initialState, action) {
    if (action.type === 'GET_TARGET_TASK') {
        return {
            ...state,
            targetTask: action.payload
        }
    }
    return state;
};
