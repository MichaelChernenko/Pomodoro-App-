const initialState = {
    taskPageTrigger: 'To Do'
};

export default function taskPageTrigger(state = initialState, action) {
    if (action.type === 'SWITCH_TO_DONE') {
        return {
            ...state,
            taskPageTrigger: action.payload
        }
    }
    return state;
};
