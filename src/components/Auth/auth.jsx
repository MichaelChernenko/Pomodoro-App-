import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataService from '../../services/firebaseDataService';
import { getAuthUser } from '../../actions/getAuthUser';
import { withRouter, Redirect } from 'react-router-dom';
import logo from './../../assets/images/logo.png'
import './auth.css';


class Auth extends Component {
    constructor(props) {
        super(props);
        this.db = new DataService();
    }

    createUser(e) {
        e.preventDefault();
        const emailField = document.getElementById('email-field').value;
        const passlField = document.getElementById('pass-field').value;

        this.db.createUser(emailField, passlField).then(result => {
            if (result.code !== undefined) {
                this.props.onAuthError(this.formatErrorCode(result.code));
                return;
            } else {
                this.props.onRegistration(true)
                this.db.observeUserChange(this.getUserId.bind(this))
            }
        })
    }

    loginUser(e) {
        e.preventDefault();
        const emailField = document.getElementById('email-field').value;
        const passlField = document.getElementById('pass-field').value;

        this.db.signIn(emailField, passlField).then(result => {
            if (result.code !== undefined) {
                this.props.onAuthError(this.formatErrorCode(result.code));
                console.log(this.props.authError)
                return;
            } else {
                this.db.observeUserChange(this.getUserId.bind(this))
            }
        })
    }

    changeAuthMode(e) {
        e.preventDefault();
        const target = e.target;

        document.getElementById('email-field').value = '';
        document.getElementById('pass-field').value = '';

        if (target.tagName === 'A') {
            if (target.text === 'Login') {
                target.nextElementSibling.nextElementSibling.classList.remove('auth-choice__btn--active');
            } else {
                target.previousElementSibling.previousElementSibling.classList.remove('auth-choice__btn--active');
            }

            target.classList.add('auth-choice__btn--active')
            this.props.onChangeModeClick(target.text)
        }

        this.props.onAuthError('');
    }

    getUserId(value) {
        this.props.onAuthClick(value.uid)
    }

    formatErrorCode(code) {
        return code.substr(5).replace(/[-]/g, " ");
    }

    render() {
        return (
            this.props.auth.length > 1 && this.props.newUser === false ? <Redirect to={{ pathname: '/taskList' }} /> : this.props.auth.length > 1 && this.props.newUser ? <Redirect to={{ pathname: '/firstEntrance' }} /> :
                <div className="wrapper main-wrapp">
                    <h1 className="h-logo auth-logo"><img src={logo} alt="logotype" /></h1>
                    <div onClick={this.changeAuthMode.bind(this)} className='auth-choice'>
                        <a href="" className='auth-choice__btn auth-choice__btn--active'>Login</a><span></span><a href="" className='auth-choice__btn'>Register</a>
                    </div>
                    <form action="" onSubmit={this.props.authMode === 'Register' ? this.createUser.bind(this) : this.loginUser.bind(this)} className='auth-form'>
                        {this.props.authError ? <p className='auth-error'>Error : {this.props.authError}</p> : null}
                        <p>Email</p>
                        <input type="text" id="email-field" />
                        <p>Password</p>
                        <input type="text" id="pass-field" />
                        <button className='auth-btn '>{this.props.authMode === 'Login' ? 'Login' : 'Register'}</button>
                    </form>
                </div>

        );
    }
}

export default withRouter(connect(
    state => ({
        auth: state.authUser.userID,
        authMode: state.authMode.authMode,
        authError: state.authMode.authError,
        newUser: state.authMode.newUser
    }),
    dispatch => ({
        onAuthClick: (value) => {
            dispatch(getAuthUser(value))
        },
        onChangeModeClick: (value) => {
            return dispatch({ type: 'CHANGE_AUTH_MODE', payload: value })
        },
        onAuthError: (value) => {
            return dispatch({ type: 'ERROR_ON_AUTH', payload: value })
        },
        onRegistration: (value) => {
            return dispatch({ type: 'REGISTER_USER', payload: value })
        }
    })
)(Auth));
