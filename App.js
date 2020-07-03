import React, {useReducer, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import Header from './components/Header';
import AsyncStorage from '@react-native-community/async-storage';
function generateCards(n) {
  let cards = [];
  for (let i = 0; i < n / 2; i++) {
    cards.push({number: i, status: 'notFound'});
    cards.push({number: i, status: 'notFound'});
  }
  return cards;
}
function App() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      // console.log(action);
      switch (action.type) {
        case 'Replay':
          return {
            loading: false,
            level: 1,
            score: 0,
            time: 60,
            cards: generateCards(4).sort(function () {
              return 0.5 - Math.random();
            }),
            rows: 2,
            columns: 2,
          };
        case 'UpdateStateFromStorage':
          if (action.data) return {...action.data, loading: false};
          return {...state, loading: false};
        case 'NoDataInStorage':
          return {...state, loading: false};
        case 'GoToNextLevel': {
          const nextLevel = state.level + 1;
          const boxes = 2 + 2 * nextLevel;
          const [newRows, newColumns] =
            boxes > state.rows * state.columns
              ? state.rows === state.columns
                ? [state.rows + 1, state.columns]
                : [state.rows, state.columns + 1]
              : [state.rows, state.columns];

          return {
            ...state,
            level: state.level + 1,
            time: (state.level + 1) * 60,
            cards: generateCards(2 + 2 * (state.level + 1)).sort(function () {
              return 0.5 - Math.random();
            }),
            rows: newRows,
            columns: newColumns,
          };
        }
        case 'tick': {
          if (state.time === 0) {
            return state;
          }
          return {...state, time: state.time - 1};
        }
        case 'opencard':
          if (state.time === 0) {
            return state;
          }
          const prevOpenedCardIndex = state.cards.findIndex(
            (card) => card.status === 'firstTry',
          );
          if (prevOpenedCardIndex !== -1) {
            const prevCard = state.cards[prevOpenedCardIndex];
            if (prevCard.number === state.cards[action.data].number) {
              return {
                ...state,
                score: state.score + state.level * 10,
                cards: state.cards.map((card, i) => {
                  if (i === prevOpenedCardIndex || i === action.data) {
                    return {...card, status: 'found'};
                  } else {
                    return card;
                  }
                }),
              };
            } else {
              return {
                ...state,
                cards: state.cards.map((card, index) =>
                  index === action.data ? {...card, status: 'secondTry'} : card,
                ),
              };
            }
          } else {
            return {
              ...state,
              cards: state.cards.map((card, index) =>
                index === action.data ? {...card, status: 'firstTry'} : card,
              ),
            };
          }
        case 'FlipTwoCards':
          return {
            ...state,
            cards: state.cards.map((card) =>
              card.status === 'firstTry' || card.status === 'secondTry'
                ? {...card, status: 'notFound'}
                : card,
            ),
          };
        default:
          return state;
      }
    },
    {
      loading: true,
      level: 1,
      score: 0,
      time: 60,
      cards: generateCards(4).sort(function () {
        return 0.5 - Math.random();
      }),
      rows: 2,
      columns: 2,
    },
  );
  // console.log(JSON.stringify(state));
  useEffect(() => {
    AsyncStorage.getItem('@gameState')
      .then((state) =>
        dispatch({type: 'UpdateStateFromStorage', data: JSON.parse(state)}),
      )
      .catch(() => dispatch({type: 'NoDataInStorage'}));
  }, []);
  if (state.loading) {
    return <Header />;
  }
  return <Game state={state} dispatch={dispatch} />;
}
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
function Card({card, onPress, disabled}) {
  if (card.status === 'notFound')
    return (
      <TouchableOpacity
        disabled={disabled}
        style={{flex: 1, backgroundColor: 'green', margin: 5, borderRadius: 5}}
        onPress={onPress}></TouchableOpacity>
    );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        margin: 5,
        borderColor:
          card.status == 'firstTry' || card.status == 'secondTry'
            ? 'green'
            : 'grey',
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>{card.number}</Text>
    </View>
  );
}
function Layout({rows, columns, children}) {
  // console.log({rows, columns, children});
  const rowsView = [];
  for (let i = 0; i < rows; i++) {
    const columnsView = [];
    // console.log({i, noofchildren});
    for (let j = 0; j < columns; j++) {
      // console.log({index: columns * i + j});
      columnsView.push(columns * i + j);
    }
    // console.log({columnsView});
    rowsView.push(columnsView);
  }
  // console.log({rowsView});
  // console.log({rowsView});
  // const a = <View style={{flex: 1, flexDirection: 'column'}}>{rowsView}</View>;
  // console.log({a});
  return (
    <View style={{flex: 1, margin: 5}}>
      {rowsView.map((columnsView, index) => (
        <View style={{flex: 1, flexDirection: 'row'}} key={index}>
          {columnsView.map((id) => (
            <View style={{flex: 1}} key={id}>
              {id < children.length && children[id]}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
function Details({label, value}) {
  return (
    <View
      style={{
        // backgroundColor: '#f3f3f3',
        flex: 1,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 17,
          textAlign: 'center',
          textAlignVertical: 'center',
        }}>
        {label}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'red',
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        {value}
      </Text>
    </View>
  );
}
export default App;
