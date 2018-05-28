import React, { Component } from 'react';
import tomatoImage from './../../assets/images/tomato-addv02.svg'

class DailyTask extends Component {
    render() {
        return (
            <div className='main-wrapp'>
                {this.props.mode === 'empty' ?
                    <section className="any-tasks">
                        <div className="first-visit__img">
                            <img src={tomatoImage} alt="" />
                        </div>
                        <div className="first-visit__msg">You don’t have any tasks left.<br />
                            Add new tasks to stay productive.
                    </div>
                    </section>
                    : this.props.mode === 'emptyDaily' ?
                        <div className="task-list-msg task-list-msg--ex">
                            Excellent,<br /> all daily tasks done! :)
                </div>
                        : this.props.mode === 'emptyDone' ?
                            <div className="task-list-msg task-list-msg--drag">
                                Task added,<br /> drag it to the top 5 in daily task list
                </div>
                            :
                            <ul className={`task-menu task-menu--daily ${this.props.removeMode !== undefined ? 'task-menu--remove' : ''}`}>
                                {this.props.dailyTasks !== undefined ?
                                    this.props.dailyTasks.daily.map((value, index) =>
                                        <li key={index} className={`task-menu__item task-menu__item--${value.priority} clearfix`} data-key={value.id}
                                            data-priority={value.priority}>
                                            <div className={`task-menu__date task-menu__date--${value.categoryName}`}
                                                data-cat-name={value.categoryName}><span
                                                    className="day">{value.deadline}</span>
                                            </div>
                                            <div className="task-menu__text">
                                                <h3>{value.heading}</h3>
                                                <p>{value.taskText}</p>
                                            </div>
                                            <div className="task-menu__edit">
                                                <ul>
                                                    <li onClick={this.props.callEdit} className="task-menu__edit--ed" data-key={value.id}></li>
                                                </ul>
                                            </div>
                                            <div className="task-menu__pomodoro task-menu__pomodoro--start icon">
                                                <button><span>{value.estimation}</span></button>
                                            </div>
                                        </li>
                                    ) : null}
                            </ul>
                }
            </div>
        )
    }
}

export default DailyTask;
