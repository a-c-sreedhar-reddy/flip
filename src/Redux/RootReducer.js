import {combineReducers} from 'redux';

import {reducer as game} from './Game/GameReducers';

const rootReducer = () =>
  combineReducers({
    game,
  });

export default rootReducer;
