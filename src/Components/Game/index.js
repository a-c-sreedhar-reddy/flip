import React, {useEffect} from 'react';
import {View, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../Header';
import Details from '../Details';
import Layout from '../Layout';
import Card from '../Card';

function Game({state, dispatch}) {
  const {level, score, time, cards, rows, columns} = state;
  const timesUp = time === 0;
  useEffect(() => {
    if (!timesUp) {
      const interval = setInterval(() => dispatch({type: 'tick'}), 1000);
      return () => clearInterval(interval);
    }
  }, [timesUp, level, dispatch]);
  const firstCard = cards.findIndex((card) => card.status === 'firstTry');
  const secondCard = cards.findIndex((card) => card.status === 'secondTry');
  const canToggle = firstCard === -1 || secondCard === -1;
  useEffect(() => {
    if (firstCard !== -1 && secondCard !== -1) {
      setTimeout(
        () => dispatch({type: 'FlipTwoCards', data: [firstCard, secondCard]}),
        500,
      );
    }
  }, [dispatch, firstCard, secondCard]);
  useEffect(() => {
    const hasGameCompleted = cards.every((card) => card.status === 'found');
    hasGameCompleted && dispatch({type: 'GoToNextLevel'});
  }, [cards, dispatch]);
  useEffect(() => {
    const state = {level, score, time, cards, rows, columns};
    AsyncStorage.setItem('@gameState', JSON.stringify(state));
  }, [cards, columns, level, rows, score, time]);
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
                dispatch({type: 'Replay'});
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
              onPress={() =>
                !timesUp && canToggle && dispatch({type: 'opencard', data: i})
              }
            />
          ))}
        </Layout>
      </View>
    </View>
  );
}
export default Game;
