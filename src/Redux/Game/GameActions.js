import * as GameConstants from './GameConstants';

export const replay = (payload) => ({
  type: GameConstants.Replay,
  payload,
});
export const UpdateStateFromStorage = (payload) => ({
  type: GameConstants.UpdateStateFromStorage,
  payload,
});
export const NoDataInStorage = (payload) => ({
  type: GameConstants.NoDataInStorage,
  payload,
});
export const GoToNextLevel = (payload) => ({
  type: GameConstants.GoToNextLevel,
  payload,
});
export const tick = (payload) => ({
  type: GameConstants.tick,
  payload,
});
export const opencard = (payload) => ({
  type: GameConstants.opencard,
  payload,
});
export const FlipTwoCards = (payload) => ({
  type: GameConstants.FlipTwoCards,
  payload,
});
