import React, { Component } from 'react';
import SettingsPage from './containers/settingsPage';
import './App.css';

class App extends Component {
  render() {
    return (
        <div className='wrapper'>
          <SettingsPage />
        </div>
    );
  }
}

export default App;
