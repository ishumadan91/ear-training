import settings from './settings';
import {combineReducers} from 'redux';

//Combine all the sub reducers
const rootReducer = combineReducers({
    settings
})

export default rootReducer