import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import { composeWithDevTools } from 'redux-devtools-extension';
import createEncryptor from 'redux-persist-transform-encrypt'
import thunk from 'redux-thunk';
import './index.css';
import './App.css';
import Auth from './components/Auth/auth';
import Settings from './containers/settingsPage'
import TaskList from './containers/taskListPage'
import TaskListRemove from './containers/taskPageRemove';
import FirstEntrance from './components/firstEntrance/firstEntrance';
import reducers from './reducers';

const encryptor = createEncryptor({
    secretKey: 'my-super-secret-key',
    onError: function (error) {
        // Handle the error.
    }
})

const persistConfig = {
    key: 'root',
    storage,
    transform: [encryptor]
}

const persistedReducer = persistReducer(persistConfig, reducers)

let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
let persistor = persistStore(store)

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Auth} />
                    <Route path='/settings' component={Settings} />
                    <Route path='/taskList' component={TaskList} />
                    <Route path='/taskRemove' component={TaskListRemove} />
                    <Route path='/firstEntrance' component={FirstEntrance} />
                </Switch>
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

