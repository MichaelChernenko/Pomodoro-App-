import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter , Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import './index.css';
import './App.css';
import Settings from './containers/settingsPage'
import TaskList from './containers/taskListPage'
import TaskListRemove from './containers/taskPageRemove';
import reducers from './reducers';

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Route exact path='/' component={Settings} />
                <Route path='/taskList' component={TaskList} />
                <Route path='/taskRemove' component={TaskListRemove} />
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

