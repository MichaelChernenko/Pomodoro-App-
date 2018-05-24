const initialState = {
    settingsSwitch: 'Pomodoros'
};

export default function settingsTrigger(state = initialState, action) {
    if (action.type === 'SWITCH_TO_CATEGORIES') {
        return {
            ...state,
            settingsSwitch: action.payload
        }
    }
    return state;
};
