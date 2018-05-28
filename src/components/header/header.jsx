import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DataService from '../../services/firebaseDataService';
import logo from './../../assets/images/logo.png'
import { changeModalMode } from '../../actions/changeModalMode';
import { getAuthUser } from '../../actions/getAuthUser';
import './header.css';

export const data = [
      {
        iconClass: 'global-list',
        typeClass: 'gl-list',
        hash: '/taskList'
      },
      {
        iconClass: 'statistic',
        typeClass: 'stat',
        hash: '/report'
      },
      {
        iconClass: 'settings',
        typeClass: 'sett',
        hash: '/settings'
      },
      {
        iconClass: 'signOut',
        typeClass: 'signOut signOut',
        hash: '/'
      }
];

export const dataTask = [
      {
        iconClass: 'delete',
        typeClass: 'delete',
        hash: '/taskRemove'
      },
      {
        iconClass: 'global-list',
        typeClass: 'gl-list',
        hash: '/taskList'
      },
      {
        iconClass: 'statistic',
        typeClass: 'stat',
        hash: '/report'
      },
      {
        iconClass: 'settings',
        typeClass: 'sett',
        hash: '/settings'
      },
      {
        iconClass: 'signOut',
        typeClass: 'signOut signOut',
        hash: '/'
      }
    ];

class Header extends Component {
    componentDidMount() {
        if (window.location.pathname === '/taskRemove') {
            document.querySelector('.add-task-btn--header').classList.add('hidden');
        }
        document.addEventListener('scroll', this.makeSticky);

        const db = new DataService();

        document.querySelector('.signOut').addEventListener('click', e => {
            db.signOut();
            this.props.onAuthClick('')
        })
    }

    componentWillUnmount() {
        document.documentElement.removeEventListener('scroll', this.makeSticky);
    }

    makeSticky() {
        let header = document.querySelector('.sticky-header');
        header.classList.add('sticky-header--visible');

        if (window.location.pathname === '/taskList' || window.location.pathname === '/taskRemove') {
          document.querySelector('.add-task-btn--header').classList.remove('hidden');
        }

        if (window.pageYOffset === 0) {
          header.classList.remove('sticky-header--visible');
          document.querySelector('.add-task-btn--header').classList.add('hidden');
        }
    }

    addModalCall() {
        this.props.onModalAddClick('addMode');
    }

    render() {
        return (
            <header className="sticky-header clearfix">
                <div className="wrapper wrapper--header">
                    <h1 className="h-logo"><a href="task-list.html"><img src={logo} alt="logotype" /></a></h1>
                    <nav className="clearfix">
                        <button onClick={this.addModalCall.bind(this)} className={`add-task-btn add-task-btn--header hidden`}></button>
                        <ul className="top-menu clearfix">
                            {this.props.nav.map((data, index) => 
                                <Link to={data.hash} className={`top-menu__item top-menu__item--${data.typeClass}`} key={index}><span
                                className={`icon icon--${data.iconClass}`}></span></Link>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        onModalAddClick: (value) => {
            dispatch(changeModalMode(value));
        },
        onAuthClick: (value) => {
            dispatch(getAuthUser(value))
        },
    })
  )(Header);
  
