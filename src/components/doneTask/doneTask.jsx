import React, { Component } from 'react';

class DoneTask extends Component {
    render() {
        return (
            <div className='main-wrapp'>
                <ul className={`task-menu task-menu--done`}>
                    {this.props.dailyTasks !== undefined ?
                        this.props.dailyTasks.done.map((value, index) =>
                            <li key={index} className={`task-menu__item task-menu__item--${value.priority} task-menu__item--done clearfix`}
                                data-key={value.id}>
                                <div className={`task-menu__date task-menu__date--${value.categoryName}`}><span
                                    className="day">{value.deadline}</span>
                                </div>
                                <div className="task-menu__text">
                                    <h3>{value.heading}</h3>
                                    <p>{value.taskText}</p>
                                </div>
                                <div className="task-menu__edit">
                                    <ul>
                                        <li className="task-menu__edit--ed"></li>
                                    </ul>
                                </div>
                                <div className="task-menu__pomodoro icon">
                                    <button><span>{value.estimation}</span></button>
                                </div>
                            </li>
                        ) : null}
                </ul>
            </div>
        )
    }
}

export default DoneTask;
