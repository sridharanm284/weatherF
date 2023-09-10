import { combineReducers } from "redux";
import appReducer from './appReducer';

export const reducers = {
    app:appReducer
}
const  rootReducer = combineReducers(reducers);
export default rootReducer;