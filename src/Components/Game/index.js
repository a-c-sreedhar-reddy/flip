import React, {useEffect} from 'react';
import {View, Button} from 'react-native';
import Header from '../Header';
import Details from '../Details';
import Layout from '../Layout';
import Card from '../Card';
import {
  replay,
  tick,
  flipTwoCards,
  goToNextLevel,
  openCard,
} from '../../Redux/Game/GameActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

function Game({state, dispatch, ...props}) {
  const {level, score, time, cards, rows, columns} = state;
  const timesUp = time === 0;
  useEffect(() => {
    if (!timesUp) {
      const interval = setInterval(() => props.tick(), 1000);
      return () => clearInterval(interval);
    }
  }, [timesUp, level]);
  const firstCard = cards.findIndex((card) => card.status === 'firstTry');
  const secondCard = cards.findIndex((card) => card.status === 'secondTry');
  const canToggle = firstCard === -1 || secondCard === -1;
  useEffect(() => {
    if (firstCard !== -1 && secondCard !== -1) {
      setTimeout(() => props.flipTwoCards(), 500);
    }
  }, [firstCard, secondCard]);
  useEffect(() => {
    const hasGameCompleted = cards.every((card) => card.status === 'found');
    hasGameCompleted && props.goToNextLevel();
  }, [cards]);
  const mins = parseInt(time / 60, 10);
  const secs = parseInt(time % 60, 10);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Header />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Details label="Level" value={level} />
          <Details label="Score" value={score} />
        </View>
        <View style={{flex: 1, justifyContent: 'flex-start'}}>
          <Details
            label="Time Left"
            value={`${mins}: ${secs <= 9 ? '0' + String(secs) : secs}`}
          />
        </View>
        <View style={{flex: 1, marginHorizontal: 10}}>
          {timesUp && (
            <Button
              title="replay"
              color="grey"
              onPress={() => {
                // console.log('replay');
                props.replay();
                // dispatch({type: 'Replay'});
              }}
            />
          )}
        </View>
      </View>
      <View style={{flex: 3}}>
        <Layout rows={rows} columns={columns}>
          {cards.map((card, i) => (
            <Card
              disabled={timesUp}
              key={i}
              card={card}
              onPress={() => !timesUp && canToggle && props.openCard(i)}
            />
          ))}
        </Layout>
      </View>
    </View>
  );
}
const mapStateToProps = function (state) {
  return {
    state: state.game,
  };
};
const mapDispatchToProps = (dispatch) => ({
  tick: bindActionCreators(tick, dispatch),
  replay: bindActionCreators(replay, dispatch),
  flipTwoCards: bindActionCreators(flipTwoCards, dispatch),
  goToNextLevel: bindActionCreators(goToNextLevel, dispatch),
  openCard: bindActionCreators(openCard, dispatch),
  dispatch,
});
export default connect(mapStateToProps, mapDispatchToProps)(Game);
