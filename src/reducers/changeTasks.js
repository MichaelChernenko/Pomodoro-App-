const initialState = {
    tasks: undefined,
    dailyTaskMode: ''
};

export default function changeTasks(state = initialState, action) {
    if (action.type === 'GET_TASKS') {
        return {
            ...state,
            tasks: action.payload
        }
    } else if (action.type === 'ON_LOAD_PAGE') {
        return {
            ...state,
            dailyTaskMode: action.payload
        }
    }
    return state;
};
