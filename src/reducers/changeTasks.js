const initialState = [];

export default function changeTasks(state = initialState, action) {
    if (action.type === 'GET_TASKS') {
        return {
            ...state,
            dailyTasks: action.payload
        }
    }
    return state;
};
