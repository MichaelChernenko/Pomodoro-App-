import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataService from '../services/firebaseDataService';
import Header from '../components/header/header';
import DailyTask from '../components/dailyTask/dailyTask';
import GlobalTask from '../components/globalTask/globalTask';
import DoneTask from '../components/doneTask/doneTask';
import Modal from '../components/modal/modal';
import { dataTask } from '../components/header/header';
import { getTasks } from '../actions/getTasks';
import { switchTaskList } from '../actions/switchTaskList';
import { changeModalMode } from '../actions/changeModalMode';
import { getTargetTask } from '../actions/getTargetTask';
import { switchGlobalList } from '../actions/switchGlobalList'
import taskListPage from './taskListPage';
import '../components/dailyTask/dailyTask.css';

class TaskListPageRemove extends Component {
    constructor(props) {
        super(props);
        this.db = new DataService();
        let removeKeys = [];
    }

    componentWillMount() {
        this.getTasks();
    }

    componentDidMount() {
        this.selectAllDailyRemove('.task-list__filter--select', '.task-menu--daily');
        this.selectRemovingItem();
        this.getListenerForRemove();
    }

    getListenerForRemove() {
        let removeBtn = document.querySelector('.top-menu__item--delete');
        let self = this;
    
        removeBtn.addEventListener('click', e => {
          e.preventDefault();
          e.stopImmediatePropagation();
          this.props.onModalEditClick('removeMode', null)
        })
      }

    getTasks() {
        this.db.getOnceData(this.props.userID + '/tasks/').then(result => this.sortTasks(result.val()))
    }

    getRemoveItems() {
        let items = document.querySelectorAll('.remove-item');
        let keyArr = [];

        for (let i = 0; i < items.length; i++) {
            keyArr.push(items[i].parentElement.getAttribute('data-key'))
        }

        this.renderRemoveCount(items.length);

        this.removeKeys = keyArr;
    }

    selectAllDailyRemove(container, list) {
        let filter = document.querySelector(container);

        filter.addEventListener('click', e => {
            e.preventDefault();
            let target = e.target;
            if (target.tagName == 'A') {
                let value = target.innerHTML;

                if (value === 'Select All') {
                    let collection = document.querySelectorAll('' + list + ' .task-menu__date');

                    for (let i = 0; i < collection.length; i++) {
                        collection[i].classList.add('remove-item');
                    }

                } else if (value === 'Deselect All') {
                    let collection = document.querySelectorAll('' + list + ' .task-menu__date');

                    for (let i = 0; i < collection.length; i++) {
                        collection[i].classList.remove('remove-item');
                    }
                }
                this.getRemoveItems();
            }

        })
    }

    selectRemovingItem() {
        let cont = document.querySelector('.task-list');
        cont.addEventListener('click', e => {
          let target = e.target;
          if (target.classList.contains('task-menu__date')) {
            if (target.classList.contains('remove-item')) {
              target.classList.remove('remove-item');
            } else {
              target.classList.add('remove-item');
            }
          }
          this.getRemoveItems();
        })
      }

    renderRemoveCount(val) {
        let delBtn = document.querySelector('.top-menu__item--delete');
    
        if (val !== 0) {
          delBtn.classList.add('icon--delete-active');
          delBtn.setAttribute('data-count', val);
        } else {
          delBtn.classList.remove('icon--delete-active');
        }
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
        } else if (daily.length === 0 && done.length === 0) {
            emptyDone = true;
        } else if (daily.length === 0) {
            emptyDaily = true;
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

    render() {
        return (
            <div className='task-list'>
                {this.props.modal === 'removeMode' || this.props.modal === 'editMode' ? <Modal removeKeys={this.removeKeys} action={this.sortTasks.bind(this)} /> : null}
                <Header nav={dataTask} />
                <div className="wrapper sticky-h task-wrapp main-wrapp">
                    <div className="h-cont"><h1 className="task-list-add">Daily Task List</h1>
                        <button className="add-task-btn hidden"></button>
                    </div>
                    <section className="task-list clearfix" >
                        <ul className="task-list__filter task-list__filter--select clearfix">
                            <li><a href="#">Select All</a></li>
                            <li><a href="#">Deselect All</a></li>
                        </ul>
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
                {this.props.triggerState === 'To Do' ? <DailyTask removeMode={true} callEdit={this.onEditTaskClick.bind(this)} dailyTasks={this.props.dailyTasks} /> : <DoneTask dailyTasks={this.props.dailyTasks} />}
                <div className="task-menu__bottom-line clearfix main-wrapp main-wrapp--global">
                    <a onClick={this.triggerGLobalList.bind(this)} className="gl-list-link" href="">Global List ></a>
                </div>
                {this.props.globalListTrigger ?
                    <div>
                        <div className='main-wrapp'>
                            <ul className="task-list__filter task-list__filter--select global-remove-menu clearfix">
                                <li><a href="#">Select All</a></li>
                                <li><a href="#">Deselect All</a></li>
                            </ul>
                        </div>
                        <GlobalTask removeAction={this.selectAllDailyRemove.bind(this)} removeMode={true} callSetDaily={this.setToDaily.bind(this)} callEdit={this.onEditTaskClick.bind(this)} dailyTasks={this.props.dailyTasks} />
                    </div> : null}
            </div>
        );
    }
}

export default connect(
    state => ({
        dailyTasks: state.changeTasks.tasks,
        triggerState: state.taskListPageTrigger.taskPageTrigger,
        modal: state.changeModalMode.modalMode,
        globalListTrigger: state.globalListTrigger.globalListTrigger,
        userID: state.authUser.userID,
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
        }
    })
)(TaskListPageRemove);