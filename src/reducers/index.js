import { combineReducers } from 'redux';
import settingsPageTrigger from './settingsPageTrigger';
import changeTasks from './changeTasks'
import taskListPageTrigger from './taskListPageTrigger';
import globalListFilter from './globalListFilter';
import changeModalMode from './changeModalMode';
import targetTask from './targetTask';
import globalListTrigger from './globalListTrigger';

export default combineReducers({
    settingsPageTrigger,
    changeTasks,
    taskListPageTrigger,
    globalListFilter,
    changeModalMode,
    targetTask,
    globalListTrigger
})