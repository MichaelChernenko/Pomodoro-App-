import React, {Component} from 'react';
import { connect } from 'react-redux';
import Header from '../components/header/header';
import Settings from '../components/settings/settings';
import Categories from '../components/categories/categories';
import { data } from '../components/header/header';

class SettingsPage extends Component {
    render() {
        return (
            <div className='main-wrapp--global'>
                <Header nav={data}/>
                {this.props.triggerState == 'Pomodoros' ? <Settings /> : <Categories />} 
            </div>
        );
    }
}

export default connect(
  state => ({
    triggerState: state.settingsPageTrigger.settingsSwitch
  }),
    dispatch => ({})
  )(SettingsPage);