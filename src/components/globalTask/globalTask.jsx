import React, { Component } from 'react';
import { connect } from 'react-redux';
import { globalListFilter } from '../../actions/globalListFilter';

class GlobalTask extends Component {
    filterGlobalList(e) {
        e.preventDefault();
        this.props.onFilterClick(e.target.textContent.toLowerCase());

        let filter = document.querySelector('.task-list__filter-priority');
        for (let i = 0; i < filter.children.length; i++) {
            if (filter.children[i].classList.contains('active')) {
              filter.children[i].classList.remove('active')
            }
          }
    
          if (e.target.tagName == 'A') {
            e.target.parentNode.classList.add('active');
          }
    }

    componentDidMount() {
        if (this.props.removeMode !== undefined) {
            this.props.removeAction('.global-remove-menu', '.task-menu__global');
        }
    }

    componentWillUnmount() {
        this.props.onFilterClick('all');
    }

    render() {
        let filterMode = true
        if (this.props.globalFilter !== 'all') {
            filterMode = this.props.globalFilter;
        }
        return (
            <div className='main-wrapp'>
                <div className="gl-list-cont">
                    <ul onClick={this.filterGlobalList.bind(this)} className="task-list__filter task-list__filter-priority clearfix">
                        <li className="active"><a href="">All</a></li>
                        <li><a href="">Urgent</a></li>
                        <li><a href="">High</a></li>
                        <li><a href="">Middle</a></li>
                        <li><a href="">Low</a></li>
                    </ul>

                    <div className="clear-box"></div>

                    {this.props.dailyTasks !== undefined ?
                        Object.entries(this.props.dailyTasks.global).map((value, index) =>
                            value[1].priorityList.includes(filterMode) || filterMode === true ?
                            <ul key={index} className={`task-menu task-menu__global ${this.props.removeMode !== undefined ? 'task-menu--remove' : ''} task-menu__global--${value[1].categoryName} clearfix`}>
                                <span className="task-menu__global-h">{value[1].categoryName}</span>
                                {value[1].items.map((value, index) =>
                                    value.priority === filterMode || filterMode === true ? 
                                    <li key={index} className={`task-menu__item task-menu__item--${value.priority} clearfix`} data-key={value.id}
                                        data-priority={value.priority}>
                                        <div className={`task-menu__date task-menu__date--${value.categoryName} `} data-cat-name={value.categoryName}><span
                                            className="future-day day"><span
                                                className="future-day-b">{value.deadline}</span></span></div>
                                        <div className="task-menu__text">
                                            <h3>{value.heading}</h3>
                                            <p>{value.taskText}</p>
                                        </div>
                                        <div className="task-menu__edit">
                                            <ul>
                                                <li onClick={this.props.callSetDaily} className="task-menu__edit--up" data-key={value.id}></li>
                                                <li onClick={this.props.callEdit} className="task-menu__edit--ed" data-key={value.id}></li>
                                            </ul>
                                        </div>
                                        <div className="task-menu__pomodoro task-menu__pomodoro--start icon">
                                            <button><span>{value.estimation}</span></button>
                                        </div>
                                    </li> : null
                                )}
                            </ul> : null
                        ) : null}
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        globalFilter: state.globalListFilter.filter
    }),
    dispatch => ({
        onFilterClick: (value) => {
            dispatch(globalListFilter(value));
        }
    })
)(GlobalTask);
