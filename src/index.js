import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter , Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import './index.css';
import './App.css';
import Auth from './components/Auth/auth';
import Settings from './containers/settingsPage'
import TaskList from './containers/taskListPage'
import TaskListRemove from './containers/taskPageRemove';
import FirstEntrance from './components/firstEntrance/firstEntrance';
import reducers from './reducers';

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Auth} />
                <Route path='/settings' component={Settings} />
                <Route path='/taskList' component={TaskList} />
                <Route path='/taskRemove' component={TaskListRemove} />
                <Route path='/firstEntrance' component={FirstEntrance}/>
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

