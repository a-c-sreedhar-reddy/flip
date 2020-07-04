import React, {useReducer, useEffect, useState} from 'react';
import Header from './src/Components/Header';
import AsyncStorage from '@react-native-community/async-storage';
import Game from './src/Components/Game';

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
          if (action.data) {
            return {...action.data, loading: false};
          }
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

export default App;
