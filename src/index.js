import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'Styles/main.scss';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from 'Reducers/rootReducer';

const store = createStore(rootReducer)

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
