import React from 'react';
import Header from './src/Components/Header';
import Game from './src/Components/Game';
import {replay} from './src/Redux/Game/GameActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
function App({state, dispatch}) {
  if (state.loading) {
    return <Header />;
  }
  return <Game state={state} dispatch={dispatch} />;
}
const mapStateToProps = function (state) {
  return {
    state: state.game,
  };
};

const mapDispatchToProps = (dispatch) => ({
  replay: bindActionCreators(replay, dispatch),
  dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
