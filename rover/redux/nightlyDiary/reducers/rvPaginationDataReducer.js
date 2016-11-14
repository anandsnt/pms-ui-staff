const callBackReducer = (state = [], action) => {
  switch (action.type) {
    case 'DIARY_VIEW_CHANGED':
        return action.callbackFromAngular;
    default:
        return state.callbackFromAngular;
  }
};