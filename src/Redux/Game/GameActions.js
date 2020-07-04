import * as GameConstants from './GameConstants';

export const replay = () => ({
  type: GameConstants.Replay,
});
export const goToNextLevel = () => ({
  type: GameConstants.GoToNextLevel,
});
export const tick = () => ({
  type: GameConstants.tick,
});
export const openCard = (data) => ({
  type: GameConstants.opencard,
  data,
});
export const flipTwoCards = () => ({
  type: GameConstants.FlipTwoCards,
});
