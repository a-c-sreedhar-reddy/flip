import * as GameConstants from './GameConstants';

export const replay = () => ({
  type: GameConstants.REPLAY,
});
export const goToNextLevel = () => ({
  type: GameConstants.GO_TO_NEXT_LEVEL,
});
export const tick = () => ({
  type: GameConstants.TICK,
});
export const openCard = (data) => ({
  type: GameConstants.OPEN_CARD,
  data,
});
export const flipTwoCards = () => ({
  type: GameConstants.FLIP_TWO_CARDS,
});
