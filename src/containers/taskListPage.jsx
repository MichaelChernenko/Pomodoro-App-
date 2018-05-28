import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataService from '../services/firebaseDataService';
import Header from '../components/header/header';
import DailyTask from '../components/dailyTask/dailyTask';
import GlobalTask from '../components/globalTask/globalTask';
import DoneTask from '../components/doneTask/doneTask';
import Modal from '../components/modal/modal';
import { withRouter } from 'react-router-dom'
import { dataTask } from '../components/header/header';
import { getTasks } from '../actions/getTasks';
import { switchTaskList } from '../actions/switchTaskList';
import { changeModalMode } from '../actions/changeModalMode';
import { getTargetTask } from '../actions/getTargetTask';
import { switchGlobalList } from '../actions/switchGlobalList'
import '../components/dailyTask/dailyTask.css';

class TaskListPage extends Component {
    constructor(props) {
        super(props);
        this.db = new DataService();
    }

    componentWillMount() {
        this.getTasks();
    }

    getTasks() {
        this.db.getOnceData(this.props.userID + '/tasks/').then(result => this.sortTasks(result.val()))
    }

    triggerDoneList(e) {
        this.props.onSwitchClick(e.target.textContent);

        const value = e.target.innerHTML;

        if (value === 'To Do') {
            e.target.parentNode.classList.add('active');
            e.target.parentNode.nextElementSibling.classList.remove('active');
        } else if (value === 'Done') {
            e.target.parentNode.classList.add('active');
            e.target.parentNode.previousElementSibling.classList.remove('active');
        }
    }

    triggerGLobalList(e) {
        e.preventDefault();
        console.log(this.props.globalListTrigger)
        console.log(!this.props.globalListTrigger)
        this.props.onGlobalClick(!this.props.globalListTrigger)
    }

    sortTasks(data) {
        let empty = false;
        let emptyDaily = false;
        let emptyDone = false;
        let daily = [];
        let global = {};
        let done = [];

        if (data !== null) {
            for (let i = 1; i < data.length; i++) {

                if (data[i].isRemoved === false) {
                    if (data[i].isDone === false) {
                        if (data[i].isDaily === true) {
                            daily.push(data[i]);
                        } else {
                            if (global.hasOwnProperty(data[i].categoryName)) {
                                global[data[i].categoryName].items.push(data[i]);
                            } else {
                                global[data[i].categoryName] = {
                                    categoryName: data[i].categoryName,
                                    items: [],
                                    priorityList: []
                                };

                                global[data[i].categoryName].items.push(data[i]);

                                if (!global[data[i].categoryName].priorityList.includes(data[i].priority)) {
                                    global[data[i].categoryName].priorityList.push(data[i].priority);
                                }
                            }
                        }
                    } else {
                        done.push(data[i]);
                    }
                }
            }
        }

        if (Object.keys(global).length === 0 && daily.length === 0) {
            empty = true;
            this.props.onLoadPageCheck('empty')
        } else if (daily.length === 0 && done.length === 0) {
            emptyDone = true;
            this.props.onLoadPageCheck('emptyDone')
        } else if (daily.length === 0) {
            emptyDaily = true;
            this.props.onLoadPageCheck('emptyDaily')
        }

        let tasks = {
            daily: daily,
            global: global,
            done: done
        };

        for (let category in tasks.global) {
            tasks.global[category].items.map(elem => {
                if (!tasks.global[category].priorityList.includes(elem.priority)) {
                    tasks.global[category].priorityList.push(elem.priority)
                }
            })
        }

        this.props.getTasks(tasks)
    }

    setToDaily(e) {
        let updates = {};
        updates[this.props.userID + '/tasks/' + e.target.dataset.key + '/isDaily'] = true;
        updates[this.props.userID + '/tasks/' + e.target.dataset.key + '/deadline'] = 'today';

        this.db.updateData(updates)
        this.getTasks()
        this.props.onLoadPageCheck('')
    }

    onEditTaskClick(e) {
        const el = document.querySelector('.task-menu__item[data-key="' + e.target.dataset.key + '"]');

        const current = {
            title: el.querySelector('.task-menu__text h3').innerHTML,
            text: el.querySelector('.task-menu__text p').innerHTML,
            estimation: el.querySelector('.task-menu__pomodoro button span').innerHTML,
            deadline: el.querySelector('.day').textContent,
            category: el.querySelector('.task-menu__date').getAttribute('data-cat-name'),
            priority: el.getAttribute('data-priority'),
            key: el.getAttribute('data-key')
        };

        this.props.onModalEditClick('editMode', current)
    }

    addModalCall() {
        this.props.onModalAddClick('addMode');
    }

    render() {
        return (
            <div>
                {this.props.modal === 'addMode' || this.props.modal === 'editMode' ? <Modal action={this.sortTasks.bind(this)} /> : null}
                <Header nav={dataTask} />
                <div className="wrapper sticky-h task-wrapp main-wrapp">
                    <div className="h-cont"><h1 className="task-list-add">Daily Task List</h1>
                        <button onClick={this.addModalCall.bind(this)} className="add-task-btn"></button>
                    </div>
                    <section className="task-list clearfix" >
                        <ul onClick={this.triggerDoneList.bind(this)} className="task-list__filter task-list__filter--done clearfix">
                            <li className="active"><a href="#">To Do</a></li>
                            <li><a href="#">Done</a></li>
                        </ul>
                        <div className="clear-box"></div>
                        <div className="task-menu--daily">
                            <section className="any-tasks hidden">
                                <div className="first-visit__img">
                                    <img src="../assets/images/tomato-addv02.svg" alt="" />
                                </div>
                                <div className="first-visit__msg">You don’t have any tasks left.<br />
                                    Add new tasks to stay productive.
                        </div>
                            </section>
                            <div className="task-list-msg task-list-msg--ex hidden">
                                Excellent,<br /> all daily tasks done! :)
                </div>
                            <div className="task-list-msg task-list-msg--drag hidden">
                                Task added,<br /> drag it to the top 5 in daily task list
                </div>
                        </div>
                    </section>
                </div>
                {this.props.triggerState === 'To Do' ? <DailyTask mode={this.props.dailyTaskMode} callEdit={this.onEditTaskClick.bind(this)} dailyTasks={this.props.dailyTasks} /> : <DoneTask dailyTasks={this.props.dailyTasks} />}
                <div className="task-menu__bottom-line clearfix main-wrapp main-wrapp--global">
                    <a onClick={this.triggerGLobalList.bind(this)} className="gl-list-link" href="">Global List ></a>
                </div>
                { this.props.globalListTrigger ? <GlobalTask callSetDaily={this.setToDaily.bind(this)} callEdit={this.onEditTaskClick.bind(this)} dailyTasks={this.props.dailyTasks} /> : null }
            </div>
        );
    }
}

export default withRouter(connect(
    state => ({
        dailyTasks: state.changeTasks.tasks,
        triggerState: state.taskListPageTrigger.taskPageTrigger,
        modal: state.changeModalMode.modalMode,
        globalListTrigger : state.globalListTrigger.globalListTrigger,
        userID: state.authUser.userID,
        dailyTaskMode: state.changeTasks.dailyTaskMode
    }),
    dispatch => ({
        getTasks: (tasks) => {
            dispatch(getTasks(tasks));
        },
        onSwitchClick: (value) => {
            dispatch(switchTaskList(value));
        },
        onModalEditClick: (value, targetValue) => {
            dispatch(changeModalMode(value));
            dispatch(getTargetTask(targetValue))
        },
        onGlobalClick: (value) => {
            dispatch(switchGlobalList(value));
        },
        onLoadPageCheck: (value) => {
            dispatch({ type: 'ON_LOAD_PAGE', payload: value })
        },
        onModalAddClick: (value) => {
            dispatch(changeModalMode(value));
        }
    })
)(TaskListPage));