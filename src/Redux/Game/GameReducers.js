import * as GameConstants from './GameConstants';
function generateCards(n) {
  let cards = [];
  for (let i = 0; i < n / 2; i++) {
    cards.push({number: i, status: 'notFound'});
    cards.push({number: i, status: 'notFound'});
  }
  return cards;
}
const INITIAL_STATE = {
  level: 1,
  score: 0,
  time: 60,
  cards: generateCards(4).sort(function () {
    return 0.5 - Math.random();
  }),
  rows: 2,
  columns: 2,
};

export function reducer(state = INITIAL_STATE, action) {
  // console.log(action);
  switch (action.type) {
    case 'REPLAY':
      return {
        level: 1,
        score: 0,
        time: 60,
        cards: generateCards(4).sort(function () {
          return 0.5 - Math.random();
        }),
        rows: 2,
        columns: 2,
      };
    case 'GO_TO_NEXT_LEVEL': {
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
    case 'TICK': {
      if (state.time === 0) {
        return state;
      }
      return {...state, time: state.time - 1};
    }
    case 'OPEN_CARD':
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
    case 'FLIP_TWO_CARDS':
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
}
