// combinedReducers.js
function combineReducers(reducers:any) {
  return (state: any, action: any) => {
    return Object.keys(reducers).reduce((nextState: any, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
}

export default combineReducers;
