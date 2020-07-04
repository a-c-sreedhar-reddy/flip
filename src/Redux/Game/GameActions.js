import * as GameConstants from './GameConstants';

export const replay = (payload) => ({
  type: GameConstants.Replay,
  payload,
});
export const goToNextLevel = (payload) => ({
  type: GameConstants.GoToNextLevel,
  payload,
});
export const tick = (payload) => ({
  type: GameConstants.tick,
  payload,
});
export const openCard = (payload) => ({
  type: GameConstants.opencard,
  payload,
});
export const flipTwoCards = (payload) => ({
  type: GameConstants.FlipTwoCards,
  payload,
});
