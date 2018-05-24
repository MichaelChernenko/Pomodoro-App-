import React, { Component } from 'react';
import { connect } from 'react-redux';  
import { switchSettings } from '../../actions/switchSettings';
import './categories.css';


class Categories extends Component {

    switchPages(e) {
        this.props.onSwitchClick(e.target.textContent);
      }
    

    render() {
        return (
            <div className="wrapper main-wrapp">
                <section className="settings sticky-h">
                    <h1>Settings</h1>
                    <h2>Сategories list overview</h2>
                    <ul onClick={this.switchPages.bind(this)} className="mode-menu clearfix">
                        <li className="mode-menu__item"><a href="#settings">Pomodoros</a></li>
                        <li className="mode-menu__item"><a className="active" href="#categories">Categories</a></li>
                    </ul>
                    <ul className="categories-menu">
                        <li className="categories-menu__item categories-menu__item--orange"><input type="text" value="Work" readOnly/></li>
                        <li className="categories-menu__item categories-menu__item--blue"><input type="text" value="Education" readOnly/></li>
                        <li className="categories-menu__item categories-menu__item--purple"><input type="text" value="Hobby" readOnly/></li>
                        <li className="categories-menu__item categories-menu__item--red"><input type="text" value="Sport" readOnly/></li>
                        <li className="categories-menu__item categories-menu__item--green"><input type="text" value="Other" readOnly/></li>
                    </ul>

                    <a href="/taskList"><button className="btn btn--blue">Go to Tasks</button></a>
                </section>
            </div>
        );
    }
}

export default connect(
    state => ({
      triggerState: state.settingsPageTrigger.settingsSwitch
    }),
    dispatch => ({
      onSwitchClick: (value) => {
        dispatch(switchSettings(value));
      }
    })
  )(Categories);
