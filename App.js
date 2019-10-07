import React from 'react';
import {
    StyleSheet, Text,
} from 'react-native';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import AppReducer from './app/reducers';
import { AppContainer } from './app/components/AppNavigator';

const store = createStore(AppReducer, applyMiddleware(thunk));

const App = () =>
    (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );

Text.defaultProps.style = { fontFamily: 'lucida grande' }
export default App;