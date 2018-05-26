import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataService from '../../services/firebaseDataService';
import { changeModalMode } from '../../actions/changeModalMode';
import { getTasks } from '../../actions/getTasks';
import './modal.css';

class Modal extends Component {

    componentDidMount() {
        const div = document.createElement('div');
        div.classList.add('dark-block');
        document.body.appendChild(div);

        if (this.props.mode === 'editMode') {
            // document.querySelector('.modal-menu__delete').setAttribute('data-key', key);
            document.getElementById('title').value = this.props.targetTaskValue.title;
            document.getElementById('description').value = this.props.targetTaskValue.text;
            document.getElementById('deadline').value = this.props.targetTaskValue.deadline;
            document.querySelector('input[name="task-group"][value="' + this.props.targetTaskValue.category + '"]').setAttribute('checked', true);
            document.querySelector('input[name="estimation-group"][value="' + this.props.targetTaskValue.estimation + '"]').setAttribute('checked', true);
            document.querySelector('input[name="priority-group"][value="' + this.props.targetTaskValue.priority + '"]').setAttribute('checked', true);
        }
    }

    onCloseClick() {
        this.props.onModalCloseClick('closeMode')
        const darkBlock = document.querySelector('.dark-block');
        darkBlock.classList.remove('dark-block');
    }

    onAddClick() {
        this.addTaskToDB();
        this.props.onModalCloseClick('closeMode')
        const darkBlock = document.querySelector('.dark-block');
        darkBlock.classList.remove('dark-block');
    }

    removeTask() {
        const db = new DataService();
        const keys = this.props.removeKeys;
        let updates = {};
    
        for (let i = 0; i < keys.length; i++) {
          updates[this.props.userId + '/tasks' + keys[i] + '/isRemoved'] = true;
        }
    
        db.updateData(updates);
        db.getOnceData(this.props.userId + '/tasks').then(result => this.props.action(result.val()))
        this.onCloseClick();
      }

    addTaskToDB() {
        const db = new DataService();
        let title,
            descr,
            deadline,
            category,
            estimation,
            priority;

        try {
            title = document.getElementById('title').value;
            descr = document.getElementById('description').value;
            deadline = document.getElementById('deadline').value;
            category = document.querySelector('input[name="task-group"]:checked').value;
            estimation = document.querySelector('input[name="estimation-group"]:checked').value;
            priority = document.querySelector('input[name="priority-group"]:checked').value;
        } catch (err) {
            return;
        }

        let key = 0;

        db.getOnceData(this.props.userId + '/tasks').then(result => result.val())
            .then((result) => {
                console.log('hello', this.props.userId)
                if (result === null) {
                    key = 0;
                } else {
                    key = result.length - 1;
                }
            })
            .then(() => {

                let data = {
                    id: key + 1,
                    heading: title,
                    taskText: descr,
                    deadline: deadline,
                    priority: priority,
                    isDaily: false,
                    isRemoved: false,
                    isDone: false,
                    categoryName: category,
                    estimation: estimation
                };

                if (this.props.mode === 'editMode') {
                    let updates = {};

                    updates[this.props.userId + '/tasks' + this.props.targetTaskValue.key + '/heading'] = title;
                    updates[this.props.userId + '/tasks' + this.props.targetTaskValue.key + '/taskText'] = descr;
                    updates[this.props.userId + '/tasks' + this.props.targetTaskValue.key + '/deadline'] = deadline;
                    updates[this.props.userId + '/tasks' + this.props.targetTaskValue.key + '/categoryName'] = category;
                    updates[this.props.userId + '/tasks' + this.props.targetTaskValue.key + '/estimation'] = estimation;
                    updates[this.props.userId + '/tasks' + this.props.targetTaskValue.key + '/priority'] = priority;

                    db.updateData(updates);
                } else {
                    db.add(data, key + 1, this.props.userId);
                }

                db.getOnceData(this.props.userId + '/tasks').then(result => this.props.action(result.val()))
            })
    }
    render() {
        return (
            <div>
                {this.props.mode !== 'removeMode' ?
                    <div className="modal modal--edit clearfix" >
                        <ul className="modal-menu">
                            {this.props.mode === 'editMode' ?
                                <li className="modal-menu__delete"></li>
                                : null}
                            <li onClick={this.onAddClick.bind(this)} className="modal-menu__add"></li>
                            <li onClick={this.onCloseClick.bind(this)} className="modal-menu__close"></li>
                        </ul>
                        <div className="modal-wrap">
                            <div className="clear-box"></div>

                            <h2>{this.props.mode === 'editMode' ? 'Edit' : 'Add'} Task</h2>
                            <ul className="modal__content">
                                <li className="modal__item">
                                    <h3>title</h3>
                                    <input type="text" id="title" placeholder="Add title here" />
                                </li>
                                <li className="modal__item">
                                    <h3>description</h3>
                                    <input type="text" id="description" placeholder="Add description here" />
                                </li>
                                <li className="modal__item clearfix">
                                    <h3>Category</h3>
                                    <label className="radio-work"><input type="radio" value="work"
                                        name="task-group" /><span></span>Work</label>
                                    <label className="radio-edu"><input type="radio" value="education" name="task-group" /><span></span>Education</label>
                                    <label className="radio-hobby"><input type="radio" value="hobby"
                                        name="task-group" /><span></span>Hobby</label>
                                    <label className="radio-sport"><input type="radio" value="sport"
                                        name="task-group" /><span></span>Sport</label>
                                    <label className="radio-other"><input type="radio" value="other"
                                        name="task-group" /><span></span>Other</label>
                                </li>
                                <li className="modal__item">
                                    <h3>deadline</h3>
                                    <input type="text" id="deadline" placeholder="May 23, 2016" />
                                </li>
                                <li className="modal__item clearfix">
                                    <h3>Estimation</h3>
                                    <label className="estimation"><input type="radio" value="1"
                                        name="estimation-group" /><span></span></label>
                                    <label className="estimation"><input type="radio" value="2"
                                        name="estimation-group" /><span></span></label>
                                    <label className="estimation"><input type="radio" value="3"
                                        name="estimation-group" /><span></span></label>
                                    <label className="estimation"><input type="radio" value="4"
                                        name="estimation-group" /><span></span></label>
                                    <label className="estimation"><input type="radio" value="5"
                                        name="estimation-group" /><span></span></label>
                                </li>
                                <li className="modal__item clearfix">
                                    <h3>Priority</h3>
                                    <label className="radio-urgent"><input type="radio" value="urgent" name="priority-group" /><span></span>Urgent</label>
                                    <label className="radio-high"><input type="radio" value="high"
                                        name="priority-group" /><span></span>High</label>
                                    <label className="radio-middle"><input type="radio" value="middle" name="priority-group" /><span></span>Middle</label>
                                    <label className="radio-low"><input type="radio" value="low"
                                        name="priority-group" /><span></span>low</label>
                                </li>
                            </ul>
                        </div>
                    </div> : <div className="modal modal--remove clearfix">
                        <ul className="modal-menu">
                            <li onClick={this.onCloseClick.bind(this)} className="modal-menu__close"></li>
                        </ul>
                        <div className="modal-wrap">
                            <div className="clear-box"></div>

                            <h2>Remove Task</h2>
                            <p className="modal--remove__info">Are you sure you want to remove selected task(s)?</p>
                            <div className="btn-cont">
                                <button onClick={this.onCloseClick.bind(this)} className="btn btn--blue btn--remove-modal btn--remove-modal--decline">Cancel</button>
                                <button onClick={this.removeTask.bind(this)} className="btn btn--red btn--remove-modal btn--remove-modal--accept">Remove</button>
                            </div>
                        </div>
                    </div>}
            </div>
        );
    }
}

export default connect(
    state => ({
        mode: state.changeModalMode.modalMode,
        targetTaskValue: state.targetTask.targetTask,
        userId: state.authUser.userID
    }),
    dispatch => ({
        onModalCloseClick: (value) => {
            dispatch(changeModalMode(value));
        },
        getTasks: (tasks) => {
            dispatch(getTasks(tasks));
        },
    })
)(Modal);
