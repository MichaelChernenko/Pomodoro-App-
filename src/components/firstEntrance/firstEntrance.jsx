import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import Header from '../header/header';
import { data } from '../header/header';
import tomatoImage from './../../assets/images/tomato_settings.svg'
import './firstEntrance.css';


class FirstEntrance extends Component {
    render() {
        return (
            <div>
                <Header nav={data} />
                <div className="wrapper main-wrapp">
                    <section className="first-visit sticky-h">
                        <div className="h-cont"><h1 className="task-list-add">Daily Task List</h1></div>
                        <div className="first-visit__img">
                            <img src={tomatoImage} alt="" />
                        </div>
                        <div className="first-visit__msg">As you visited our site for a first time you can check
        and customize your default application settings</div>
                        <div className="btn-cont">
                            <a href="/taskList"><button className="btn btn--blue">Skip</button></a>
                            <a href="/settings"><button className="btn btn--green">Go to Settings</button></a>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(
    state => ({

    }),
    dispatch => ({

    })
)(FirstEntrance));
