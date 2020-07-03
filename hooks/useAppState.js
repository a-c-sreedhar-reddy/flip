import {useState, useEffect} from 'react';
import {AppState} from 'react-native';
function useAppState() {
  const [appState, setAppState] = useState(AppState.currentState);
  const _handleAppStateChange = (nextAppState) => {
    setAppState(nextAppState);
  };
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);
  return appState;
}
export default useAppState;
